""" Utility module for persisting and retrieving weekly blacklist records. """

from typing import Optional

from app import DB, app
from app.persistence.models import UserEventResults, ModeratorReviewRequest, User

# -------------------------------------------------------------------------------------------------

# -------------------------------------------------------------------------------------------------
# Functions and types below are intended to be used directly.
# -------------------------------------------------------------------------------------------------

def get_moderator_review_request_by_results_id(user_event_results_id: int) -> Optional[ModeratorReviewRequest]:
    """ Returns the moderator review request for the specified user event results, or else `None` if no such
    record exists. """

    return ModeratorReviewRequest.query.filter_by(results_id=user_event_results_id).first()


def create_moderator_review_request(results: UserEventResults,
                                    requesting_user: User) -> None:
    """ Creates a weekly blacklist record for the specified user if it doesn't already exist.
    If it does exist, take no action. """

    if get_weekly_blacklist_entry_by_user_id(user.id):
        return

    weekly_blacklist_record = WeeklyBlacklist(user_id=user.id)
    DB.session.add(weekly_blacklist_record)
    DB.session.commit()

    app.logger.info(__LOG_CREATED_WEEKLY_BLACKLIST.format(username=user.username),
        extra={'user_id': user.id, 'username': user.username})