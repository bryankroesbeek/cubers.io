import { Reducer, Action } from 'redux'

import { ProfileRankings, ProfileRecords, ProfileHistory, ProfileHistoryEvent } from "../../types/profile";

export type ProfileState = {
    rankings: ProfileRankings | "loading"
    records: ProfileRecords | "loading"
    history: ProfileHistory | "loading"

    selectedEvent: ProfileHistoryEvent | "none"
}

export type ProfileAction = Action<"NONE"> |
    Action<"FETCH_PROFILE_STATISTICS"> & { statistics: ProfileRankings } |
    Action<"FETCH_PROFILE_RECORDS"> & { records: ProfileRecords } |
    Action<"FETCH_PROFILE_HISTORY"> & { history: ProfileHistory } |
    Action<"SET_ACTIVE_PROFILE_HISTORY_EVENT"> & { historyEvent: ProfileHistoryEvent }