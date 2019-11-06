import { Reducer, Action } from 'redux'

import { CompeteState, CompeteAction } from '../types/competeTypes'

const initialState: CompeteState = {
    event: "loading"
}

export const competeReducer: Reducer<CompeteState, CompeteAction> = (state = initialState, action): CompeteState => {
    switch (action.type) {
        case "FETCH_EVENT":
            return { ...state, event: action.event }
    }

    return state
}