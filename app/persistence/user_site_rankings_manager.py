""" Utility module for persisting and retrieving UserSiteRankings. """

import json

from sqlalchemy.sql import func

from app import DB
from app.persistence.models import UserSiteRankings, User

# -------------------------------------------------------------------------------------------------

def get_site_rankings_for_user(user_id):
    """ Retrieves a UserSiteRankings record for the specified user. """

    return DB.session.\
        query(UserSiteRankings).\
        filter(UserSiteRankings.user_id == user_id).\
        first()


def get_user_site_rankings_all_sorted_single():
    """ Retrieves all UserSiteRankings sorted by combined single sum of ranks, excluding records
    with the maximum combined single sum of ranks. These indicate users who haven't participated
    at all. """

    max_combined_single = DB.session.\
        query(func.max(UserSiteRankings.sum_all_single)).\
        first()[0]

    return DB.session.\
        query(UserSiteRankings.sum_all_single, User).\
        join(User).\
        filter(UserSiteRankings.sum_all_single != max_combined_single).\
        order_by(UserSiteRankings.sum_all_single.asc()).\
        all()


def get_user_site_rankings_all_sorted_average():
    """ Retrieves all UserSiteRankings sorted by combined average sum of ranks, excluding records
    with the maximum combined average sum of ranks. These indicate users who haven't participated
    at all. """

    max_combined_average = DB.session.\
        query(func.max(UserSiteRankings.sum_all_average)).\
        first()[0]

    return DB.session.\
        query(UserSiteRankings.sum_all_average, User).\
        join(User).\
        filter(UserSiteRankings.sum_all_average != max_combined_average).\
        order_by(UserSiteRankings.sum_all_average.asc()).\
        all()


def get_user_site_rankings_wca_sorted_single():
    """ Retrieves all UserSiteRankings sorted by WCA single sum of ranks, excluding records
    with the maximum WCA single sum of ranks. These indicate users who haven't participated
    at all. """

    max_combined_single = DB.session.\
        query(func.max(UserSiteRankings.sum_wca_single)).\
        first()[0]

    return DB.session.\
        query(UserSiteRankings.sum_wca_single, User).\
        join(User).\
        filter(UserSiteRankings.sum_wca_single != max_combined_single).\
        order_by(UserSiteRankings.sum_wca_single.asc()).\
        all()


def get_user_site_rankings_wca_sorted_average():
    """ Retrieves all UserSiteRankings sorted by WCA average sum of ranks, excluding records
    with the maximum WCA average sum of ranks. These indicate users who haven't participated
    at all. """

    max_combined_average = DB.session.\
        query(func.max(UserSiteRankings.sum_wca_average)).\
        first()[0]

    return DB.session.\
        query(UserSiteRankings.sum_wca_average, User).\
        join(User).\
        filter(UserSiteRankings.sum_wca_average != max_combined_average).\
        order_by(UserSiteRankings.sum_wca_average.asc()).\
        all()


def get_user_site_rankings_non_wca_sorted_single():
    """ Retrieves all UserSiteRankings sorted by non-WCA single sum of ranks, excluding records
    with the maximum non-WCA single sum of ranks. These indicate users who haven't participated
    at all. """

    max_combined_single = DB.session.\
        query(func.max(UserSiteRankings.sum_non_wca_single)).\
        first()[0]

    return DB.session.\
        query(UserSiteRankings.sum_non_wca_single, User).\
        join(User).\
        filter(UserSiteRankings.sum_non_wca_single != max_combined_single).\
        order_by(UserSiteRankings.sum_non_wca_single.asc()).\
        all()


def get_user_site_rankings_non_wca_sorted_average():
    """ Retrieves all UserSiteRankings sorted by non-WCA average sum of ranks, excluding records
    with the maximum non-WCA average sum of ranks. These indicate users who haven't participated
    at all. """

    max_combined_average = DB.session.\
        query(func.max(UserSiteRankings.sum_non_wca_average)).\
        first()[0]

    return DB.session.\
        query(UserSiteRankings.sum_non_wca_average, User).\
        join(User).\
        filter(UserSiteRankings.sum_non_wca_average != max_combined_average).\
        order_by(UserSiteRankings.sum_non_wca_average.asc()).\
        all()


def get_user_kinchranks_wca_sorted():
    """ Retrieves all Kinchranks sorted by WCA Kinchrank, except those with a value of 0.
    These indicate users who haven't participated at all. """

    return DB.session.\
        query(UserSiteRankings.wca_kinchrank, User.username).\
        join(User).\
        filter(UserSiteRankings.wca_kinchrank != 0).\
        order_by(UserSiteRankings.wca_kinchrank.desc()).\
        all()


def get_user_kinchranks_non_wca_sorted():
    """ Retrieves all Kinchranks sorted by non-WCA Kinchrank, except those with a value of 0.
    These indicate users who haven't participated at all. """

    return DB.session.\
        query(UserSiteRankings.non_wca_kinchrank, User.username).\
        join(User).\
        filter(UserSiteRankings.non_wca_kinchrank != 0).\
        order_by(UserSiteRankings.non_wca_kinchrank.desc()).\
        all()


def get_user_kinchranks_all_sorted():
    """ Retrieves all Kinchranks sorted by combined Kinchrank, except those with a value of 0.
    These indicate users who haven't participated at all. """

    return DB.session.\
        query(UserSiteRankings.all_kinchrank, User.username).\
        join(User).\
        filter(UserSiteRankings.all_kinchrank != 0).\
        order_by(UserSiteRankings.all_kinchrank.desc()).\
        all()


def save_or_update_site_rankings_for_user(user_id, new_user_site_rankings):
    """ Create or update a UserSiteRankings record for the specified user. """

    # TODO: We can speed this up by querying for all site rankings at once, instead of 1 at a time
    # Stick that in a dict[user_id] = site_rankings
    # Accept all the calculated site rankings above instead of just one at a time
    # Do the logic below to update or create
    # Add all the records to a list then bulk session add and commit

    rankings_record = get_site_rankings_for_user(user_id)

    # If this user already has a site rankings record, just update it
    if rankings_record:
        rankings_record.data                = new_user_site_rankings.data
        rankings_record.timestamp           = new_user_site_rankings.timestamp
        rankings_record.sum_all_single      = new_user_site_rankings.sum_all_single
        rankings_record.sum_all_average     = new_user_site_rankings.sum_all_average
        rankings_record.sum_wca_single      = new_user_site_rankings.sum_wca_single
        rankings_record.sum_wca_average     = new_user_site_rankings.sum_wca_average
        rankings_record.sum_non_wca_single  = new_user_site_rankings.sum_non_wca_single
        rankings_record.sum_non_wca_average = new_user_site_rankings.sum_non_wca_average
        rankings_record.all_kinchrank       = new_user_site_rankings.all_kinchrank
        rankings_record.wca_kinchrank       = new_user_site_rankings.wca_kinchrank
        rankings_record.non_wca_kinchrank   = new_user_site_rankings.non_wca_kinchrank
        DB.session.add(rankings_record)

    # If not, create a new one
    else:
        new_user_site_rankings.user_id = user_id
        DB.session.add(new_user_site_rankings)

    DB.session.commit()


def update_one_event_site_rankings_for_user(user_id, new_site_rankings, event):
    """ Update just one event's info for a user's UserSiteRankings if the record already exists.
    dict[event ID][(single, single_site_ranking, average, average_site_ranking)] """

    rankings_record = get_site_rankings_for_user(user_id)

    # Rankings record doesn't yet exist for this user, no need to create a new one
    if not rankings_record:
        return

    # Get dict representation of existing site rankings data, and then update the entry
    # for the specified event with the new data for that event
    existing_data = rankings_record.get_site_rankings_data_as_dict()
    existing_data[event.id] = new_site_rankings[event.id]

    # Serialize the modified rankings data back into the rankings record
    rankings_record.data = json.dumps(existing_data)

    DB.session.add(rankings_record)
    DB.session.commit()
