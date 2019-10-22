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

    if (action.type === "SET_SINGLE") {
        return {...state, type: "single"}
    }

    if (action.type === "SET_AVERAGE") {
        return {...state, type: "average"}
    }

    return state
}