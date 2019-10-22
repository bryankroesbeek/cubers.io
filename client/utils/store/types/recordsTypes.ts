import { Reducer, Action } from 'redux'

import { EventRecords } from '../../types'

export type RecordsState = {
    eventRecords: EventRecords | "loading"
    type: "single" | "average"
}

export type RecordsAction = Action<"NONE"> |
    Action<"FETCH_RECORDS"> & { payload: EventRecords } |
    Action<"SET_SINGLE"> |
    Action<"SET_AVERAGE">
