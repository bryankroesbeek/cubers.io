import { Reducer, Action } from 'redux'

import { RouterAction, RouterState } from '../types/routerTypes'

const initialState: RouterState = {
    user: "loading",
    settings: "loading"
}

export const routerReducer: Reducer<RouterState, RouterAction> = (state = initialState, action): RouterState => {
    if (action.type === "FETCH_USER_INFO") {
        return { ...state, user: action.user }
    }
    if (action.type === "FETCH_USER_SETTINGS") {
        return { ...state, settings: action.settings }
    }

    return state
}