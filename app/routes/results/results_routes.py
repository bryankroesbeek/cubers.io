""" Routes related to displaying competition results. """

from arrow import now

from flask import render_template, redirect
from flask_login import current_user

from app import CUBERS_APP
from app.business.user_results import recalculate_user_pbs_for_event
from app.persistence.comp_manager import get_active_competition, get_complete_competitions,\
    get_previous_competition, get_competition, get_all_comp_events_for_comp
from app.persistence.user_results_manager import get_all_complete_user_results_for_comp,\
    blacklist_results, unblacklist_results, UserEventResultsDoesNotExistException
from app.util.sorting import sort_user_event_results
from app.routes.util import is_admin_viewing

from app.routes import record_usage_metrics

# -------------------------------------------------------------------------------------------------

@CUBERS_APP.route('/leaderboards/<int:comp_id>/')
@record_usage_metrics
def comp_results(comp_id):
    """ A route for showing results for a specific competition. """

    competition = get_competition(comp_id)
    if not competition:
        return "Oops, that's not a real competition. Try again, ya clown."

    comp_events = get_all_comp_events_for_comp(comp_id)

    # If the page is being viewed by an admin, render the controls for toggling blacklist status
    # and also apply additional styling on blacklisted results to make them easier to see
    show_admin = is_admin_viewing()

    # Get all results including blacklisted ones
    results = get_all_complete_user_results_for_comp(comp_id, omit_blacklisted=False)

    # Filter out the appropriate blacklisted results, depending on who's viewing
    results = filter_blacklisted_results(results, show_admin, current_user)

    # Some utility mappings keyed on event name to make rendering stuff easier in the template
    event_names   = [event.Event.name for event in comp_events]
    event_results = {event.Event.name : list() for event in comp_events}
    event_formats = {event.Event.name : event.Event.eventFormat for event in comp_events}
    event_ids     = {event.Event.name : event.Event.id for event in comp_events}

    # Split the times string into components, add to a list called `"solves_helper` which
    # is used in the UI to show individual solves, and make sure the length == 5, filled
    # with empty strings if necessary
    for result in results:
        event_name = result.CompetitionEvent.Event.name
        solves_helper = result.times_string.split(', ')
        while len(solves_helper) < 5:
            solves_helper.append('')
        setattr(result, 'solves_helper', solves_helper)
        event_results[event_name].append(result)

    # Sort the results
    for event_name, results in event_results.items():
        results.sort(key=sort_user_event_results)

    alternative_title = "{} leaderboards".format(competition.title)

    return render_template("results/results_comp.html", alternative_title=alternative_title,\
        event_results=event_results, event_names=event_names, event_formats=event_formats,\
        event_ids=event_ids, show_admin=show_admin)


@CUBERS_APP.route('/redirect_curr/')
def curr_leaders():
    """ Redirects to the current competition's leaderboards. """

    comp = get_active_competition()
    return redirect("leaderboards/{}".format(comp.id))


@CUBERS_APP.route('/redirect_prev/')
def prev_leaders():
    """ Redirects to the current competition's leaderboards. """

    comp = get_previous_competition()
    return redirect("leaderboards/{}".format(comp.id))


@CUBERS_APP.route('/leaderboards/')
@record_usage_metrics
def results_list():
    """ A route for showing which competitions results can be viewed for. """

    comps = get_complete_competitions()
    comp = get_active_competition()
    return render_template("results/results_list.html", comps=comps, active=comp)

# -------------------------------------------------------------------------------------------------

DEFAULT_BLACKLIST_NOTE = """Results manually hidden by {username} on {date}."""

# -------------------------------------------------------------------------------------------------

@CUBERS_APP.route('/results/blacklist/<int:results_id>/')
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

        # Recalculate PBs just for the affected user and event
        recalculate_user_pbs_for_event(results.user_id, results.CompetitionEvent.event_id)

        return ('', 204)

    except UserEventResultsDoesNotExistException as ex:
        return (str(ex), 500)

    except Exception as ex:
        return (str(ex), 500)


@CUBERS_APP.route('/results/unblacklist/<int:results_id>/')
def unblacklist(results_id):
    """ Unblacklists the specified UserEventResults. """

    if not (current_user.is_authenticated and current_user.is_admin):
        return ("Hey, you're not allowed to do that.", 403)

    # pylint: disable=W0703
    try:
        results = unblacklist_results(results_id)

        # Recalculate PBs just for the affected user and event
        recalculate_user_pbs_for_event(results.user_id, results.CompetitionEvent.event_id)

        return ('', 204)

    except UserEventResultsDoesNotExistException as ex:
        return (str(ex), 500)

    except Exception as ex:
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
