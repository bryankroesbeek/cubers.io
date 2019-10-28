import { getUserRankings, getUserRecords, getUserHistory } from "../../api/profile"
import { ProfileAction } from "../types/profileTypes"
import { Dispatch } from "react"
import { ProfileHistoryEvent } from "../../types/profile"

export let fetchUserRankings = (dispatch: Dispatch<ProfileAction>, username: string): ProfileAction => {
    getUserRankings(username)
        .then(result => dispatch({ type: "FETCH_PROFILE_STATISTICS", statistics: result }))

    return { type: "NONE" }
}

export let fetchUserRecords = (dispatch: Dispatch<ProfileAction>, username: string): ProfileAction => {
    getUserRecords(username)
        .then(result => dispatch({ type: "FETCH_PROFILE_RECORDS", records: result }))

    return { type: "NONE" }
}

export let fetchUserHistory = (dispatch: Dispatch<ProfileAction>, username: string): ProfileAction => {
    getUserHistory(username)
        .then(result => {
            dispatch({ type: "FETCH_PROFILE_HISTORY", history: result })
            let initialEvent = getInitialEvent(result)
            if (initialEvent === "none") return
            dispatch(setActiveHistoryItem(initialEvent))
        })

    return { type: "NONE" }
}

export let setActiveHistoryItem = (event: ProfileHistoryEvent): ProfileAction => {
    return { type: "SET_ACTIVE_PROFILE_HISTORY_EVENT", historyEvent: event }
}

function getInitialEvent(history: ProfileHistoryEvent[]): ProfileHistoryEvent | "none" {
    if (history.length === 0) return "none"
    let initialEvent = history.find(h => h.event === "3x3")
    if (!initialEvent) initialEvent = history[0]

    return initialEvent
}