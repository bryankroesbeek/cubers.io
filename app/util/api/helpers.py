""" helpers for the api routes """

def restructure_solves(solves):
    """ restructure solves list to be typescript friendly """

    return list(map(lambda solve: {
        "friendlyTime": solve[0],
        "solveId": solve[1],
        "isDnf": solve[2],
        "isPlusTwo": solve[3],
        "scramble": solve[4] if solve.__len__() > 4 else None
    }, solves))
