import { Reducer, Action } from 'redux'

import { RecordsAction, RecordsState } from '../types/recordsTypes'

const initialState: RecordsState = {
    eventRecords: "loading",
    type: "single"
}

export const recordsReducer: Reducer<RecordsState, RecordsAction> = (state = initialState, action): RecordsState => {
    if (action.type === "FETCH_RECORDS") {
        return { ...state, eventRecords: action.payload }
    }

    if (action.type === "VIEW_SINGLE_RECORDS") {
        return {...state, type: "single"}
    }

    if (action.type === "VIEW_AVERAGE_RECORDS") {
        return {...state, type: "average"}
    }

    return state
}