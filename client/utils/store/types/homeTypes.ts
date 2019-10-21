import { Reducer, Action } from 'redux'

import { CompetitionEvent } from '../../types'

export type HomeState = {
    events: CompetitionEvent[] | "loading"
}

export type HomeAction = Action<"NONE"> |
    Action<"FETCH_EVENTS"> & { payload: CompetitionEvent[] }
