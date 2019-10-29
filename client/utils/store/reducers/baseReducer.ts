import { Reducer, Action } from 'redux'

import { BaseAction, BaseState } from '../types/baseTypes'

const initialState: BaseState = {
    user: "loading",
    settings: "loading"
}

export const baseReducer: Reducer<BaseState, BaseAction> = (state = initialState, action): BaseState => {
    if (action.type === "FETCH_USER_INFO") {
        return { ...state, user: action.user }
    }
    if (action.type === "GET_USER_SETTINGS") {
        return { ...state, settings: action.settings }
    }
    
    return state
}