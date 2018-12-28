""" Routes related to displaying competition results. """

from flask import render_template, redirect
from flask_login import current_user

from app import CUBERS_APP
from app.persistence.user_manager import get_user_by_username
from app.persistence.user_results_manager import get_user_competition_history

# -------------------------------------------------------------------------------------------------

@CUBERS_APP.route('/u/<username>/')
def profile(username):
    """ A route for showing a user's profile. """

    user = get_user_by_username(username)
    if not user:
        return "oops"

    comp_history = get_user_competition_history(user)
    """    dict[Event][dict[Competition][UserEventResults]] """

    solve_count = 0
    distinct_comps = set()
    for event, comps in comp_history.items():
        for comp, results in comps.items():
            distinct_comps.add(comp.id)
            solve_count += len(results.solves)

    return render_template("user/profile.html", user=user, solve_count=solve_count, comp_count=len(distinct_comps),\
        history=comp_history)
