""" Root of routes package. """

from functools import wraps

from http import HTTPStatus

from flask import abort
from flask_login import current_user

# -------------------------------------------------------------------------------------------------

def api_login_required(func):

    @wraps(func)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            return abort(HTTPStatus.UNAUTHORIZED)

        return func(*args, **kwargs)

    return decorated_function

# -------------------------------------------------------------------------------------------------

from .auth import login, logout, authorize
from .home import index
from .admin import gc_select, gc_select_user
from .util import prev_results
from .results import results_list
from .user import profile, edit_settings
from .events import event_results, sum_of_ranks, event_results_export
from .timer import timer_page
from .export import export

from .api import *
