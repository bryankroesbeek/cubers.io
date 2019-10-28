import { Dispatch } from "react"

import { getUserRankings, getUserRecords } from "../../api/profile"
import { VersusAction } from "../types/versusTypes"
import { ProfileHistoryEvent } from "../../types/profile"

export let fetchUser1Rankings = (dispatch: Dispatch<VersusAction>, username: string): VersusAction => {
    getUserRankings(username)
        .then(result => dispatch({ type: "FETCH_PROFILE_1_STATISTICS", user1Rankings: result }))

    return { type: "NONE" }
}

export let fetchUser1Records = (dispatch: Dispatch<VersusAction>, username: string): VersusAction => {
    getUserRecords(username)
        .then(result => dispatch({ type: "FETCH_PROFILE_1_RECORDS", user1Records: result }))

    return { type: "NONE" }
}

export let fetchUser2Rankings = (dispatch: Dispatch<VersusAction>, username: string): VersusAction => {
    getUserRankings(username)
        .then(result => dispatch({ type: "FETCH_PROFILE_2_STATISTICS", user2Rankings: result }))

    return { type: "NONE" }
}

export let fetchUser2Records = (dispatch: Dispatch<VersusAction>, username: string): VersusAction => {
    getUserRecords(username)
        .then(result => dispatch({ type: "FETCH_PROFILE_2_RECORDS", user2Records: result }))

    return { type: "NONE" }
}