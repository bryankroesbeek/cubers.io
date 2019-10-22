import { Reducer, Action } from 'redux'

import { SumOfRanksAction, SumOfRanksState } from '../types/sumOfRanksTypes'

const initialState: SumOfRanksState = {
    eventRecords: "loading",
    viewType: "single"
}

export const sumOfRanksReducer: Reducer<SumOfRanksState, SumOfRanksAction> = (state = initialState, action): SumOfRanksState => {
    if (action.type === "FETCH_SUM_OF_RANKS") {
        return { ...state, eventRecords: action.ranks }
    }

    if (action.type === "VIEW_SINGLE_SUM_OF_RANKS") {
        return {...state, viewType: "single"}
    }

    if (action.type === "VIEW_AVERAGE_SUM_OF_RANKS") {
        return {...state, viewType: "average"}
    }

    return state
}