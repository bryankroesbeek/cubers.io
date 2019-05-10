""" SQLAlchemy models for all database entries. """

from collections import namedtuple, OrderedDict
import json

from flask_login import LoginManager, UserMixin, AnonymousUserMixin
from sqlalchemy.orm import relationship

from app import DB, app
from app.util.times import convert_centiseconds_to_friendly_time

Text       = DB.Text
Enum       = DB.Enum
Model      = DB.Model
Column     = DB.Column
String     = DB.String
Boolean    = DB.Boolean
Integer    = DB.Integer
DateTime   = DB.DateTime
ForeignKey = DB.ForeignKey

class EventFormat():
    """ Competition event formats: Average of 5, Mean of 3, Best of 3, Best of 1. """
    Ao5 = "Ao5"
    Mo3 = "Mo3"
    Bo3 = "Bo3"
    Bo1 = "Bo1"

# Container for sum of ranks data
SumOfRanks = namedtuple('SumOfRanks', ['username', 'single', 'average'])

# -------------------------------------------------------------------------------------------------

class User(UserMixin, Model):
    """ A simple model of a user. We know these will only be created either through OAuth-ing with
    Reddit, or by uploading solve records via API call, so all we really need is a username and
    a Reddit refresh token. WCA ID is optional for user profiles. """
    __tablename__    = 'users'
    id               = Column(Integer, primary_key=True)
    username         = Column(String(64), index=True, unique=True)
    wca_id           = Column(String(10))
    refresh_token    = Column(String(64))
    is_admin         = Column(Boolean)
    is_results_mod   = Column(Boolean)
    is_verified      = Column(Boolean)
    always_blacklist = Column(Boolean)
    results          = relationship("UserEventResults", backref="User")


class Nobody(AnonymousUserMixin):
    """ Utility class for an anonymous user. Subclasses Flask-Login AnonymousUserMixin to provide the
    default behavior given to non-logged-in users, but also evaluates to false in a boolean context,
    has a default username attribute and False `is_admin`, so that `current_user` can always be used
    for logging and checking permissions directly. """

    def __init__(self, username=None):
        self.username = username if username else '<no_user>'
        self.is_admin = False
        self.is_results_mod = False

    def __bool__(self):
        return False


LOGIN_MANAGER = LoginManager(app)
@LOGIN_MANAGER.user_loader
def load_user(user_id):
    """ Required by Flask-Login for loading a user by PK. """

    return User.query.get(int(user_id))


# Return a "Nobody" instance as the anonymous user here for Flask-Login
LOGIN_MANAGER.anonymous_user = lambda: Nobody()

# -------------------------------------------------------------------------------------------------

class Event(Model):
    """ A record for a specific cubing event -- the name of the puzzle, the total number of solves
    to be completed by a competitor, and an optional description of the event. """

    __tablename__  = 'events'
    id             = Column(Integer, primary_key=True)
    name           = Column(String(64), index=True, unique=True)
    totalSolves    = Column(Integer)
    eventFormat    = Column(Enum("Ao5", "Mo3", "Bo3", "Bo1", name="eventFormat"), default="Ao5")
    description    = Column(String(128))
    CompEvents     = relationship("CompetitionEvent", backref="Event")


class ScramblePool(Model):
    """ A record that encapsulates a pre-generated scramble for a given event. """

    __tablename__ = 'scramble_pool'
    id            = Column(Integer, primary_key=True)
    event_id      = Column(Integer, ForeignKey('events.id'))
    scramble      = Column(Text())
    event         = relationship("Event", backref="scramble_pool")


class Scramble(Model):
    """ A scramble for a specific event at a specific competition. """

    __tablename__        = 'scrambles'
    id                   = Column(Integer, primary_key=True)
    scramble             = Column(Text())
    competition_event_id = Column(Integer, ForeignKey('competition_event.id'))
    solves               = relationship('UserSolve', backref='Scramble')

    def to_front_end_consolidated_dict(self):
        """ Returns a dictionary representation of this object, for use in the front-end.
        Adds a few additional fields so that the front-end object can be easily translated
        to a UserSolve object when sent back to the backend. """

        return {
            'id':        self.id,
            'scramble':  self.scramble,
            'time':      0,
            'isPlusTwo': False,
            'isDNF':     False,
        }


class UserEventResults(Model):
    """ A model detailing a user's results for a single event at competition. References the user,
    the competitionEvent, the single and average result for the event. These values are either in
    centiseconds (ex: "1234" = 12.34s), 10x units for FMC (ex: "2833" = 28.33 moves) or "DNF". """

    __tablename__     = 'user_event_results'
    id                = Column(Integer, primary_key=True)
    user_id           = Column(Integer, ForeignKey('users.id'))
    comp_event_id     = Column(Integer, ForeignKey('competition_event.id'), index=True)
    single            = Column(String(10))
    average           = Column(String(10))
    result            = Column(String(10))
    comment           = Column(Text)
    solves            = relationship('UserSolve')
    reddit_comment    = Column(String(10))
    is_complete       = Column(Boolean)
    times_string      = Column(Text)
    was_pb_single     = Column(Boolean)
    was_pb_average    = Column(Boolean)
    is_blacklisted    = Column(Boolean)
    blacklist_note    = Column(String(256))
    was_gold_medal    = Column(Boolean)
    was_silver_medal  = Column(Boolean)
    was_bronze_medal  = Column(Boolean)
    # To determine how to format friendly representations of results, single, average
    is_fmc   = False
    is_blind = False

    def set_solves(self, incoming_solves):
        """ Utility method to set a list of UserSolves for this UserEventResults. """

        self.solves.extend(incoming_solves)


    def friendly_result(self):
        """ Get a user-friendly representation of this UserEventResults's result field. """

        return self.__format_for_friendly(self.result)


    def friendly_single(self):
        """ Get a user-friendly representation of this UserEventResults's single field. """

        return self.__format_for_friendly(self.single)


    def friendly_average(self):
        """ Get a user-friendly representation of this UserEventResults's average field. """

        return self.__format_for_friendly(self.average)


    def __format_for_friendly(self, value):
        """ Utility method to return a friendly representation of the value passed in. Depends
        on whether or not this UserEventResults is for an FMC event or not. """

        if not value:
            return ''

        if value == 'DNF':
            return value

        if self.is_fmc:
            # TODO consolidate this with the jinja filter format for fmc function, and move into
            # the time utils module
            converted_value = int(value) / 100
            if converted_value == int(converted_value):
                converted_value = int(converted_value)
            return converted_value

        return convert_centiseconds_to_friendly_time(value)


    def to_log_dict(self):
        """ Converts this UserEventsResults to a dictionary representation useful in logging. """

        return {
            'solves': [s.to_log_dict() for s in self.solves],
            'is_complete': self.is_complete,
            'comment': self.comment,
            'is_blacklisted': self.is_blacklisted,
            'pb_flags': {
                'single': self.was_pb_single,
                'average': self.was_pb_average
            }
        }


class CompetitionEvent(Model):
    """ Associative model for an event held at a competition - FKs to the competition and event,
    and a JSON array of scrambles. """

    __tablename__  = 'competition_event'
    id             = Column(Integer, primary_key=True)
    competition_id = Column(Integer, ForeignKey('competitions.id'), index=True)
    event_id       = Column(Integer, ForeignKey('events.id'), index=True)
    scrambles      = relationship('Scramble', backref='CompetitionEvent',
                                  primaryjoin=id == Scramble.competition_event_id)
    user_results   = relationship('UserEventResults', backref='CompetitionEvent',
                                  primaryjoin=id == UserEventResults.comp_event_id)

    def to_front_end_consolidated_dict(self):
        """ Returns a dictionary representation of this object for use in the front-end.
        Adds a few additional fields so that the front-end object can be easily translated
        to a UserEventResults object when sent back to the backend. """

        return {
            'name':          self.Event.name,
            'scrambles':     [s.to_front_end_consolidated_dict() for s in self.scrambles],
            'event_id':      self.Event.id,
            'comp_event_id': self.id,
            'event_format':  self.Event.eventFormat,
            'comment':       '',
        }


class Competition(Model):
    """ A record for a competition -- the title of the competition, the start and end datetime,
    the list of events held, and a JSON field containing total user points results."""

    __tablename__    = 'competitions'
    id               = Column(Integer, primary_key=True)
    title            = Column(String(128))
    reddit_thread_id = Column(String(10), index=True, unique=True)
    result_thread_id = Column(String(10), index=True)
    start_timestamp  = Column(DateTime(timezone=True))
    end_timestamp    = Column(DateTime(timezone=True))
    active           = Column(Boolean)
    events           = relationship('CompetitionEvent', backref='Competition',
                                    primaryjoin=id == CompetitionEvent.competition_id)


class WeeklyMetrics(Model):
    """ A record for maintaining usage metrics for each weekly competition. """

    __tablename__   = 'weekly_metrics'
    id              = Column(Integer, primary_key=True)
    comp_id         = Column(Integer, ForeignKey('competitions.id'), index=True)
    new_users_count = Column(Integer)


class CompetitionGenResources(Model):
    """ A record for maintaining the current state of the competition generation. """

    __tablename__       = 'comp_gen_resources'
    id                  = Column(Integer, primary_key=True)
    current_comp_id     = Column(Integer)
    previous_comp_id    = Column(Integer)
    current_comp_num    = Column(Integer)
    current_bonus_index = Column(Integer)
    current_OLL_index   = Column(Integer)
    all_events          = Column(Boolean)
    title_override      = Column(String(128))


class UserSiteRankings(Model):
    """ A record for holding pre-calculated user PB single and averages, and site rankings,
    for each event they have participated in."""

    __tablename__  = 'user_site_rankings'
    id                  = Column(Integer, primary_key=True)
    user_id             = Column(Integer, ForeignKey('users.id'), index=True)
    user                = relationship('User', primaryjoin=user_id == User.id)
    data                = Column(String(2048))
    timestamp           = Column(DateTime)
    sum_all_single      = Column(Integer)
    sum_all_average     = Column(Integer)
    sum_wca_single      = Column(Integer)
    sum_wca_average     = Column(Integer)
    sum_non_wca_single  = Column(Integer)
    sum_non_wca_average = Column(Integer)

    # Save the data as a dict so we don't have to deserialize it every time it's
    # retrieved for the same object
    __data_as_dict = None

    def __get_site_rankings_data_as_dict(self):
        """ Deserializes data field to json to return site rankings info as a dict.
        If key == event_id, value = (single, single_site_ranking, average, average_site_ranking)"""

        if not self.__data_as_dict:
            # The keys (event ID) get converted to strings when serializing to json.
            # We need them as ints, so iterate through the deserialized dict, building a new
            # one with ints as keys instead of strings. Return that.
            site_rankings = OrderedDict()
            for key, value in json.loads(self.data, object_pairs_hook=OrderedDict).items():
                site_rankings[int(key)] = value
            self.__data_as_dict = site_rankings

        return self.__data_as_dict


    def get_site_rankings_and_pbs(self):
        """ Returns just the site rankings and PBs information in dictionary format, without the
        sum of ranks information. """

        return self.__get_site_rankings_data_as_dict()


    def get_combined_sum_of_ranks(self):
        """ Returns SumOfRanks data structure for combined sum of ranks. """

        return SumOfRanks(single=self.sum_all_single, average=self.sum_all_average,
            username=self.user.username)


    def get_WCA_sum_of_ranks(self):
        """ Returns SumOfRanks data structure for combined sum of ranks. """

        return SumOfRanks(single=self.sum_wca_single, average=self.sum_wca_average,
            username=self.user.username)


    def get_non_WCA_sum_of_ranks(self):
        """ Returns SumOfRanks data structure for combined sum of ranks. """

        return SumOfRanks(single=self.sum_non_wca_single, average=self.sum_non_wca_average,
            username=self.user.username)


class UserSolve(Model):
    """ A user's solve for a specific scramble, in a specific event, at a competition.
    Solve times are in centiseconds (ex: 1234 = 12.34s)."""

    __tablename__ = 'user_solves'
    id            = Column(Integer, primary_key=True)
    time          = Column(Integer)
    is_dnf        = Column(Boolean, default=False)
    is_plus_two   = Column(Boolean, default=False)
    scramble_id   = Column(Integer, ForeignKey('scrambles.id'))
    user_event_results_id = Column(Integer, ForeignKey('user_event_results.id'))


    def get_total_time(self):
        """ Returns the solve's time with +2s penalty counted, if applicable. """
        return (self.time + 200) if self.is_plus_two else self.time


    def to_log_dict(self):
        """ Converts this Solve to a dictionary representation useful in logging. """

        return {
            'time': convert_centiseconds_to_friendly_time(self.get_total_time()),
            'is_dnf': self.is_dnf,
            'is_plus_two': self.is_plus_two
        }


class UserSetting(Model):
    """ A user's preferences. """

    __tablename__ = 'user_settings'
    id            = Column(Integer, primary_key=True)
    user_id       = Column(Integer, ForeignKey('users.id'), index=True)
    user          = relationship('User', primaryjoin=user_id == User.id)
    setting_code  = Column(String(128), index=True)
    setting_value = Column(String(128), index=True)


class WeeklyBlacklist(Model):
    """ A record which, if it exists, denotes that the corresponding user should have all their
    results blacklisted for the current week's competition. """

    __tablename__ = 'weekly_blacklist'
    id            = Column(Integer, primary_key=True)
    user_id       = Column(Integer, ForeignKey('users.id'))
    reason        = Column(String(256))


class ModeratorReviewRequest(Model):
    """ A record that indicates a cubers.io has requested that the associated UserEventResults be
    reviewed by an admin or results moderator. """

    __tablename__ = 'moderator_review_request'
    id            = Column(Integer, primary_key=True)
    results_id    = Column(Integer, ForeignKey('user_event_results.id'))
    Results       = relationship('UserEventResults', primaryjoin=results_id == UserEventResults.id)
    user_id       = Column(Integer, ForeignKey('users.id'))
    ReportingUser = relationship('User', primaryjoin=user_id == User.id)
    admin_id      = Column(Integer, ForeignKey('users.id'))
    AdminUser     = relationship('User', primaryjoin=admin_id == User.id)
    isAddressed   = Column(Boolean)
