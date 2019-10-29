import { Reducer, Action } from 'redux'

import { UserSettings, User } from '../../types'

export type BaseState = {
    user: User | "loading"
    settings: UserSettings | "loading"
}
export type BaseAction = Action<"NONE"> |
    Action<"FETCH_USER_INFO"> & { user: User } |
    Action<"GET_USER_SETTINGS"> & { settings: UserSettings }