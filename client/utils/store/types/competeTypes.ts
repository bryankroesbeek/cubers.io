import { Reducer, Action } from 'redux'

import { } from '../../types'
import { Event } from '../../types/event'

export type CompeteState = {
    event: Event | "loading"
}

export type CompeteAction = Action<"NONE"> |
    Action<"FETCH_EVENT"> & { event: Event }