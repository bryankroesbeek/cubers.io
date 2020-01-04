""" Routes related to displaying competition results. """

from arrow import now

from flask import render_template, redirect, jsonify
from flask_login import current_user
from slugify import slugify

from app import app
from app.business.user_results import set_medals_on_best_event_results
from app.business.user_results.personal_bests import recalculate_user_pbs_for_event
from app.persistence.user_manager import get_user_by_username
from app.persistence.comp_manager import get_active_competition, get_complete_competitions,\
    get_previous_competition, get_competition, get_all_comp_events_for_comp, get_comp_event_by_id
from app.persistence.user_results_manager import get_all_complete_user_results_for_comp_event,\
    blacklist_results, unblacklist_results, UserEventResultsDoesNotExistException
from app.util.sorting import sort_user_results_with_rankings
from app.util.events.resources import sort_comp_events_by_global_sort_order

# -------------------------------------------------------------------------------------------------

DEFAULT_BLACKLIST_NOTE = 'Results manually hidden by {username} on {date}.'

LOG_ADMIN_BLACKLISTED = '{} blacklisted results {}'
LOG_ADMIN_UNBLACKLISTED = '{} unlacklisted results {}'
LOG_USER_VIEWING_RESULTS = '{} viewing results for {} in {}'

# -------------------------------------------------------------------------------------------------

@app.route('/api/leaderboards/comp/<int:comp_id>/')
def comp_results(comp_id):
    """ A route for showing results for a specific competition. """

    competition = get_competition(comp_id)
    if not competition:
        return "Oops, that's not a real competition. Try again, ya clown.", 404

    comp_events = get_all_comp_events_for_comp(comp_id)
    comp_events = sort_comp_events_by_global_sort_order(comp_events)

    # alternative_title = "{} leaderboards".format(competition.title)

    events = map(lambda c: {
        'name': c.Event.name,
        'format': c.Event.eventFormat,
        'compEventId': c.id,
        'eventId': c.Event.id,
        'slug': slugify(c.Event.name)
    } , comp_events)

    comp_data = {
        "compId": competition.id,
        "compTitle": competition.title,
        "events": list(events)
    }

    return jsonify(comp_data)

    # return render_template("results/results_comp.html", alternative_title=alternative_title,
    #     events_names_ids=events_names_ids, id_3x3=id_3x3, comp_id=comp_id)

@app.route('/api/leaderboards/<comp_id>/overall/')
def comp_overall_results(comp_id):
    perf_data =  get_overall_performance_data(int(comp_id))


    results = map(__get_result, perf_data)

    return jsonify(list(results))

def __get_result(res):
    user = get_user_by_username(res[0])
    result = {
        'user': {
            'id': user.id,
            'name': user.username,
            'verified': user.is_verified
        },
        'points': res[1]
    }

    return result

# @app.route('/compevent/<comp_event_id>/')
@app.route('/api/leaderboards/event/<comp_event_id>/')
def comp_event_results(comp_event_id):
    """ A route for obtaining results for a specific competition event and rendering them
    for the leaderboards pages. """

    if 'overall' in comp_event_id:
        return get_overall_performance_data(int(comp_event_id.replace('overall_', '')))

    comp_event_id = int(comp_event_id)

    comp_event = get_comp_event_by_id(comp_event_id)

    # If the page is being viewed by an admin, render the controls for toggling blacklist status
    # and also apply additional styling on blacklisted results to make them easier to see
    show_admin = current_user.is_admin

    log_msg = LOG_USER_VIEWING_RESULTS.format(current_user.username, comp_event.Event.name,
                                              comp_event.Competition.title)
    app.logger.info(log_msg, extra={'is_admin': show_admin})

    # Store the scrambles so we can show those too
    scrambles = [s.scramble for s in comp_event.scrambles]

    results = get_all_complete_user_results_for_comp_event(comp_event_id, omit_blacklisted=False)
    results = list(results)  # take out of the SQLAlchemy BaseQuery and put into a simple list

    # return jsonify(results)

    # if not results:
    #     return "Nobody has participated in this event yet. Maybe you'll be the first!"

    results = filter_blacklisted_results(results, show_admin, current_user)

    # Split the times string into components, add to a list called `"solves_helper` which
    # is used in the UI to show individual solves, and make sure the length == 5, filled
    # with empty strings if necessary
    # TODO put this in business logic somewhere
    for result in results:
        if comp_event.Event.name == 'FMC':
            solves_helper = list()
            for i, solve in enumerate(result.solves):
                scramble = solve.Scramble.scramble
                solution = solve.fmc_explanation
                moves    = solve.get_friendly_time()
                solves_helper.append((scramble, solution, moves))
            while len(solves_helper) < 5:
                solves_helper.append((None, None, None))
        else:
            solves_helper = result.times_string.split(', ')
            while len(solves_helper) < 5:
                solves_helper.append('')
        setattr(result, 'solves_helper', solves_helper)

    # Sort the results
    results_with_ranks = sort_user_results_with_rankings(results, comp_event.Event.eventFormat)

    good_results = list(map(lambda result: {
        "rank": result[0],
        "visibleRank": result[1],
        "solve": {
            "id": result[2].__dict__['id'],
            "times": result[2].__dict__['times_string'].split(', '),
            "best_single": result[2].__dict__['single'],
            "average": result[2].__dict__['average'],
            "comment": result[2].__dict__['comment'],
            "blacklisted": result[2].__dict__['is_blacklisted'],
            "user": get_user(result[2].__dict__['User'])
        }
    },results_with_ranks))

    return jsonify({
        'results': good_results,
        'scrambles': scrambles
    })

    # return render_template("results/comp_event_table.html", results=results_with_ranks,
    #     comp_event=comp_event, show_admin=show_admin, scrambles=scrambles)

def get_user(user):
    return {
        'name': user.username,
        'id': user.id,
        'verified': user.is_verified if current_user.is_admin else "none"
    }

def get_overall_performance_data(comp_id):
    """ TODO: comment """

    user_points = dict()

    for comp_event in get_all_comp_events_for_comp(comp_id):
        results = list(get_all_complete_user_results_for_comp_event(comp_event.id))

        # If nobody has participated in this particular comp event, skip performing the sorting
        # and ranking. Ranking package doesn't like empty iterables.
        if not results:
            continue

        results_with_ranks = sort_user_results_with_rankings(results, comp_event.Event.eventFormat)

        total_participants = len(results)
        for i, _, result in results_with_ranks:
            username = result.User.username
            if username not in user_points.keys():
                user_points[username] = 0
            user_points[username] += (total_participants - i)

    user_points = [(username, points) for username, points in user_points.items()]
    user_points.sort(key=lambda x: x[1], reverse=True)

    if not user_points:
        return "Nobody has participated in anything yet this week?"

    return user_points

# -------------------------------------------------------------------------------------------------

@app.route('/redirect_curr/')
def curr_leaders():
    """ Redirects to the current competition's leaderboards. """

    comp = get_active_competition()
    return redirect("leaderboards/{}".format(comp.id))


@app.route('/redirect_prev/')
def prev_leaders():
    """ Redirects to the current competition's leaderboards. """

    comp = get_previous_competition()
    return redirect("leaderboards/{}".format(comp.id))


@app.route('/api/leaderboards/')
def results_list():
    """ A route for showing which competitions results can be viewed for. """

    comps = get_complete_competitions()
    comp = get_active_competition()

    past_comps = list(map(lambda past_comp: {
        'id': past_comp[0],
        'title': past_comp[1],
        'startDate': past_comp[3],
        'endDate': past_comp[4]
    } ,comps))

    current_comp = {
        'id': comp.id,
        'title': comp.title
    }

    result = {
        'currentComp': current_comp,
        'pastComps': past_comps
    }

    return jsonify(result)

# -------------------------------------------------------------------------------------------------

@app.route('/results/blacklist/<int:results_id>/')
@app.route('/api/blacklist-result/<int:results_id>/', methods=["PUT"])
def blacklist(results_id):
    """ Blacklists the specified UserEventResults. """

    if not (current_user.is_authenticated and current_user.is_admin):
        return ("Hey, you're not allowed to do that.", 403)

    # pylint: disable=W0703
    try:
        actor = current_user.username
        timestamp = now().format('YYYY-MM-DD')
        note = DEFAULT_BLACKLIST_NOTE.format(username=actor, date=timestamp)
        results = blacklist_results(results_id, note)

        app.logger.info(LOG_ADMIN_BLACKLISTED.format(current_user.username, results.id))

        # Recalculate PBs just for the affected user and event
        recalculate_user_pbs_for_event(results.user_id, results.CompetitionEvent.event_id)

        # Recalculate podiums for this comp and event if the competition isn't active
        if not results.CompetitionEvent.Competition.active:
            set_medals_on_best_event_results([results.CompetitionEvent])

        return ('', 204)

    except UserEventResultsDoesNotExistException as ex:
        app.logger.error(str(ex))
        return (str(ex), 500)

    except Exception as ex:
        app.logger.error(str(ex))
        return (str(ex), 500)


@app.route('/results/unblacklist/<int:results_id>/')
@app.route('/api/unblacklist-result/<int:results_id>/', methods=["PUT"])
def unblacklist(results_id):
    """ Unblacklists the specified UserEventResults. """

    if not (current_user.is_authenticated and current_user.is_admin):
        return ("Hey, you're not allowed to do that.", 403)

    # pylint: disable=W0703
    try:
        results = unblacklist_results(results_id)
        app.logger.info(LOG_ADMIN_UNBLACKLISTED.format(current_user.username, results.id))

        # Recalculate PBs just for the affected user and event
        recalculate_user_pbs_for_event(results.user_id, results.CompetitionEvent.event_id)

        # Recalculate podiums for this comp and event if the competition isn't active
        if not results.CompetitionEvent.Competition.active:
            set_medals_on_best_event_results([results.CompetitionEvent])

        return ('', 204)

    except UserEventResultsDoesNotExistException as ex:
        app.logger.error(str(ex))
        return (str(ex), 500)

    except Exception as ex:
        app.logger.error(str(ex))
        return (str(ex), 500)

# -------------------------------------------------------------------------------------------------

def filter_blacklisted_results(results, show_admin, curr_user):
    """ Filters out the appropriate blacklisted results depending on who is viewing the page.
    Admins see all results, non-logged viewers see no blacklisted results, and logged-in viewers
    only see their own. """

    if show_admin:
        return results

    if not curr_user.is_authenticated:
        return [r for r in results if not r.is_blacklisted]

    target_username = curr_user.username
    return [r for r in results if (not r.is_blacklisted) or (r.User.username == target_username)]
