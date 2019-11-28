import { Dispatch } from 'redux'

import { LeaderboardCollectionAction, LeaderboardAction } from '../types/leaderboardTypes'
import { getLeaderboardCompetitions, getLeaderboardItems, getLeaderboardEvent } from '../../api'
import { LeaderboardEvent } from '../../types/leaderboards'

export let fetchLeaderboardCollection = (dispatch: Dispatch<LeaderboardCollectionAction>): LeaderboardCollectionAction => {
    getLeaderboardCompetitions()
        .then(result => dispatch({ type: "FETCH_ALL_LEADERBOARD_COMPETITIONS", collection: result }))

    return { type: "NONE" }
}

/* Leaderboard actions */
export let fetchLeaderboardById = (dispatch: Dispatch<LeaderboardAction>, id: number): LeaderboardAction => {
    getLeaderboardItems(id)
        .then(result => {
            dispatch({ type: "FETCH_COMPETITION_LEADERBOARD", data: result })
            let event = result.events.filter(e => e.slug === "3x3")[0]
            setCurrentActiveEvent(dispatch, event)
        })

    return { type: "NONE" }
}

export let setCurrentActiveEvent = (dispatch: Dispatch<LeaderboardAction>, leaderboardEvent: LeaderboardEvent): LeaderboardAction => {
    getLeaderboardEvent(leaderboardEvent.compEventId)
        .then(result => dispatch({ type: "SET_ACTIVE_EVENT", event: leaderboardEvent, leaderboard: result }))

    return { type: "NONE" }
}