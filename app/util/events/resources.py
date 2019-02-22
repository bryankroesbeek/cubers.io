""" Resources for data related to events. """

#pylint: disable=C0103

from random import choice

from pyTwistyScrambler import scrambler333, scrambler222, scrambler444, scrambler555,\
    scrambler666, scrambler777, squareOneScrambler, megaminxScrambler, pyraminxScrambler,\
    cuboidsScrambler, skewbScrambler, clockScrambler

from .coll import get_coll_scramble

# -------------------------------------------------------------------------------------------------

class EventResource:
    """ Encapsulates everything we need to know about an event. """

    # pylint: disable=C0301
    def __init__(self, name, scramble_func, num_scrambles, is_weekly, is_wca):
        self.name = name
        self.scramble_func = scramble_func
        self.num_scrambles = num_scrambles
        self.is_weekly = is_weekly
        self.is_wca = is_wca

    def get_scramble(self, *args):
        """ Returns a scramble for this event. """

        return self.scramble_func(*args)

# -------------------------------------------------------------------------------------------------

def redi_scrambler():
    """ Returns a scramble for a Redi cube in MoYu notation. """

    scramble = list()
    possible_moves = [["R", "R'"],["L", "L'"]]

    for _ in range(7):
        i = choice([0, 1]) # start each chunk with either R-moves or L-moves at random
        for n in range(choice([3, 4, 5])): # either 3, 4, or 5 moves between each 'x'
            ix = (i + n) % 2 # alternate between R-moves and L-moves each time
            scramble.append(choice(possible_moves[ix]))
        scramble.append('x')

    return ' '.join(scramble)


def COLL_scrambler(coll_num):
    """ Get a scramble for the current COLL. """

    return get_coll_scramble(coll_num)


def FMC_scrambler():
    """ Returns an FMC scramble, which is just a normal WCA scramble with R' U' F padding. """

    scramble = scrambler333.get_WCA_scramble().strip()
    while does_FMC_scramble_have_cancellations(scramble):
        scramble = scrambler333.get_WCA_scramble().strip()
    return "R' U' F {} R' U' F".format(scramble)


def does_FMC_scramble_have_cancellations(scramble):
    """ Returns whether the supplied scramble would have cancellations when padding with
    R' U' F at the beginning and end, as FMC regulations require. """

    scramble = scramble.split(' ') # turn it into a list of moves

    # check if there are any obvious cancellations: F touch F at the beginning,
    # or R touching R at the end
    first, last = scramble[0], scramble[-1]
    if first in ("F", "F2", "F'") or last in ("R", "R'", "R2"):
        return True

    # if there are no "obvious" cancellations, next check if there are less obvious ones like:
    # ex: [R' U' F] B F' <rest>   --> F B F', the F-moves cancel
    # ex: <rest> R' L' [R' U' F]  --> R' L R', the R-moves cancel

    # if the first move is a B, then the following move being an F would result in a cancellation
    if first in ("B", "B'", "B2"):
        # if the first or last move is a B or L respectively, it's possible the 2nd
        # or next-to-last moves form a cancellation with the padding
        if scramble[1] in ("F", "F2", "F'"):
            return True

    # if the last move is a L, then the preceding move being an R would result in a cancellation
    if last in ("L", "L'", "L2"):
        if scramble[-2] in ("R", "R'", "R2"):
            return True

    # no cancellations! woohoo, we can use this scramble
    return False


def scrambler_234_relay():
    """ Get a scramble for the 2-3-4 relay event. """

    s222 = scrambler222.get_WCA_scramble()
    s333 = scrambler333.get_WCA_scramble()
    s444 = scrambler444.get_random_state_scramble()

    return f'2x2: {s222}\n3x3: {s333}\n4x4: {s444}'


def scrambler_333_relay():
    """ Get a scramble for the 3x3 relay of 3 event. """

    s1 = scrambler333.get_WCA_scramble()
    s2 = scrambler333.get_WCA_scramble()
    s3 = scrambler333.get_WCA_scramble()

    return f'1: {s1}\n2: {s2}\n3: {s3}'

# -------------------------------------------------------------------------------------------------

# Weekly event definitions (current count = 19)
EVENT_2x2       = EventResource("2x2", scrambler222.get_WCA_scramble, 5, True, True)
EVENT_3x3       = EventResource("3x3", scrambler333.get_WCA_scramble, 5, True, True)
EVENT_4x4       = EventResource("4x4", scrambler444.get_random_state_scramble, 5, True, True)
EVENT_5x5       = EventResource("5x5", scrambler555.get_WCA_scramble, 5, True, True)
EVENT_6x6       = EventResource("6x6", scrambler666.get_WCA_scramble, 3, True, True)
EVENT_7x7       = EventResource("7x7", scrambler777.get_WCA_scramble, 3, True, True)
EVENT_3BLD      = EventResource("3BLD", scrambler333.get_3BLD_scramble, 3, True, True)
EVENT_3x3OH     = EventResource("3x3OH", scrambler333.get_WCA_scramble, 5, True, True)
EVENT_Square1   = EventResource("Square-1", squareOneScrambler.get_WCA_scramble, 5, True, True)
EVENT_Pyraminx  = EventResource("Pyraminx", pyraminxScrambler.get_WCA_scramble, 5, True, True)
EVENT_Megaminx  = EventResource("Megaminx", megaminxScrambler.get_WCA_scramble, 5, True, True)
EVENT_Skewb     = EventResource("Skewb", skewbScrambler.get_WCA_scramble, 5, True, True)
EVENT_Clock     = EventResource("Clock", clockScrambler.get_WCA_scramble, 5, True, True)
EVENT_3x3_Feet  = EventResource("3x3 With Feet", scrambler333.get_WCA_scramble, 5, True, True)
EVENT_FMC       = EventResource("FMC", FMC_scrambler, 3, True, True)
EVENT_2GEN      = EventResource("2GEN", scrambler333.get_2genRU_scramble, 5, True, False)
EVENT_LSE       = EventResource("LSE", scrambler333.get_2genMU_scramble, 5, True, False)
EVENT_4BLD      = EventResource("4BLD", scrambler444.get_4BLD_scramble, 3, True, True)
EVENT_5BLD      = EventResource("5BLD", scrambler555.get_5BLD_scramble, 3, True, True)

# Bonus event definitions (current count = 14)
EVENT_COLL      = EventResource("COLL", COLL_scrambler, 5, False, False)
EVENT_F2L       = EventResource("F2L", scrambler333.get_WCA_scramble, 5, False, False)
EVENT_Void      = EventResource("Void Cube", scrambler333.get_3BLD_scramble, 5, False, False)
EVENT_Mirror    = EventResource("3x3 Mirror Blocks/Bump", scrambler333.get_WCA_scramble, 5, False, False)
EVENT_Kilominx  = EventResource("Kilominx", megaminxScrambler.get_WCA_scramble, 5, False, False)
EVENT_4x4OH     = EventResource("4x4 OH", scrambler444.get_random_state_scramble, 5, False, False)
EVENT_3x3x2     = EventResource("3x3x2", cuboidsScrambler.get_3x3x2_scramble, 5, False, False)
EVENT_3x3x4     = EventResource("3x3x4", cuboidsScrambler.get_3x3x4_scramble, 5, False, False)
EVENT_3x3x5     = EventResource("3x3x5", cuboidsScrambler.get_3x3x5_scramble, 5, False, False)
EVENT_234Relay  = EventResource("2-3-4 Relay", scrambler_234_relay, 1, False, False)
EVENT_333Relay  = EventResource("3x3 Relay of 3", scrambler_333_relay, 1, False, False)
EVENT_PLLAttack = EventResource("PLL Time Attack", lambda: 'Do all the PLLs!', 1, False, False)
EVENT_2BLD      = EventResource("2BLD", scrambler222.get_WCA_scramble, 3, False, False)
EVENT_REDI      = EventResource("Redi Cube", redi_scrambler, 5, False, False)

# -------------------------------------------------------------------------------------------------

# Important! Only add new events all the way at the end, regardless of WCA or non-WCA status
# We rely on the order here
__ALL_EVENTS = [
    EVENT_2x2,
    EVENT_3x3,
    EVENT_4x4,
    EVENT_5x5,
    EVENT_6x6,
    EVENT_7x7,
    EVENT_3BLD,
    EVENT_3x3OH,
    EVENT_Square1,
    EVENT_Pyraminx,
    EVENT_Megaminx,
    EVENT_Skewb,
    EVENT_Clock,
    EVENT_3x3_Feet,
    EVENT_FMC,
    EVENT_3x3x2,
    EVENT_2GEN,
    EVENT_COLL,
    EVENT_Void,
    EVENT_333Relay,
    EVENT_F2L,
    EVENT_Mirror,
    EVENT_3x3x4,
    EVENT_Kilominx,
    EVENT_4x4OH,
    EVENT_LSE,
    EVENT_3x3x5,
    EVENT_234Relay,
    EVENT_PLLAttack,
    EVENT_2BLD,
    EVENT_4BLD,
    EVENT_5BLD,
    EVENT_REDI
]

# Important! Don't change how these weekly and bonus lists are built, we rely on the order
__WEEKLY_EVENTS = [event for event in __ALL_EVENTS if event.is_weekly]
__BONUS_EVENTS = [event for event in __ALL_EVENTS if not event.is_weekly]
__WCA_EVENTS = [event for event in __ALL_EVENTS if event.is_wca]
__NON_WCA_EVENTS = [event for event in __ALL_EVENTS if not event.is_wca]

# Important! Don't change the order of these
__COLL_LIST = [
    'B1', 'B2', 'B3', 'B4', 'B5', 'B6',
    'C1', 'C2', 'C3', 'C4', 'C5', 'C6',
    'D1', 'D2', 'D3', 'D4', 'D5', 'D6',
    'E1', 'E2', 'E3', 'E4', 'E5', 'E6',
    'F1', 'F2', 'F3', 'F4', 'F5', 'F6',
    'G1', 'G2', 'G3', 'G4', 'G5', 'G6',
    'H1', 'H2', 'H3', 'H4'
]

# -------------------------------------------------------------------------------------------------

def get_num_COLLs():
    """ Returns the length of the COLLs list. """

    return len(__COLL_LIST)


def get_num_bonus_events():
    """ Returns the length of the bonus events list. """

    return len(__BONUS_EVENTS)


def get_all_weekly_events():
    """ Return all the weekly events. """

    return __WEEKLY_EVENTS


def get_all_bonus_events():
    """ Return all the bonus events. """

    return __BONUS_EVENTS


def get_WCA_event_names():
    """ Returns the names of all WCA events. """

    return [e.name for e in __WCA_EVENTS]


def get_non_WCA_event_names():
    """ Returns the names of all non-WCA events. """

    return [e.name for e in __NON_WCA_EVENTS]


def get_bonus_events_rotation_starting_at(starting_index, count=5):
    """ Gets a list of `count` bonus events starting at the specified index. Use a doubled list
    of bonus events as a 'trick' to wrap around to the beginning if the starting index and count
    bring us past the end of the list. """

    double_wide = __BONUS_EVENTS * 2
    return double_wide[starting_index : starting_index + count]


def get_bonus_events_without_current(bonus_events):
    """ Gets a list of the bonus events except for the current ones. """

    return [e for e in __BONUS_EVENTS if e not in bonus_events]


def get_COLL_at_index(index):
    """ Gets the COLL at the specified index. """

    return __COLL_LIST[index]


def get_event_resource_for_name(event_name):
    """ Returns the event resource for the specified event name. """

    for event in __ALL_EVENTS:
        if event.name == event_name:
            return event

    return None