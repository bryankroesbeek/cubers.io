import { Dispatch } from 'redux'

import { LeaderboardCollectionAction, LeaderboardAction } from '../types/leaderboardTypes'
import { getLeaderboardCompetitions, getLeaderboardItems, getLeaderboardEvent } from '../../api'
import { LeaderboardEvent, LeaderboardItem } from '../../types/leaderboards'
import { setBlacklist } from '../../api/leaderboard'
import { cloneDeep } from 'lodash'
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

export let updateBlacklist = (dispatch: Dispatch<LeaderboardAction>, row: LeaderboardItem, type: "blacklist" | "unblacklist"): LeaderboardAction => {
    setBlacklist(row.solve.id, type)
        .then(() => {
            let newRow = cloneDeep(row)
            newRow.solve.blacklisted = type === "blacklist"
            return newRow
        })
        .then(newRow => dispatch({ type: "UPDATE_LEADERBOARD_TABLE_ROW", row: newRow }))

    return { type: "NONE" }
}