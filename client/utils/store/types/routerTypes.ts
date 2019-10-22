import { Reducer, Action } from 'redux'

import { UserSettings, User } from '../../types'

export type RouterState = {
    user: User | "loading"
    settings: UserSettings | "loading"
}
export type RouterAction = Action<"NONE"> |
    Action<"FETCH_USER_INFO"> & { user: User } |
    Action<"FETCH_USER_SETTINGS"> & { settings: UserSettings }