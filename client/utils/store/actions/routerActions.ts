import { Dispatch } from 'redux'

import { RouterAction } from '../types/routerTypes'
import { getUserInfo, getUserSettings } from '../../api'

export let getRouterInfo = (dispatch: Dispatch<RouterAction>): RouterAction => {
    getUserInfo()
        .then(res => dispatch({ type: "FETCH_USER_INFO", user: res }))

    getUserSettings()
        .then(res => dispatch({ type: "FETCH_USER_SETTINGS", settings: res }))

    return { type: "NONE" }
}