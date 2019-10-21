import { Dispatch } from 'redux'

import { HomeAction } from '../types/homeTypes'
import { getCompetitionEvents } from '../../api'

export let fetchCompetitionEvents = (dispatch: Dispatch<HomeAction>): HomeAction => {
    getCompetitionEvents()
        .then(result => dispatch({ type: "FETCH_EVENTS", payload: result }))

    return { type: "NONE" }
}