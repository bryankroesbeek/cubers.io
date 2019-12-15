import { Reducer, Action } from 'redux'

import { KinchranksAction, KinchranksState } from '../types/kinchranksTypes'

const initialState: KinchranksState = {
    eventRecords: "loading"
}

export const kinchranksReducer: Reducer<KinchranksState, KinchranksAction> = (state = initialState, action): KinchranksState => {
    if (action.type === "FETCH_KINCHRANKS") {
        return { ...state, eventRecords: action.ranks }
    }

    return state
}