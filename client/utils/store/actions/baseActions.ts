import { Dispatch } from 'redux'

import { BaseAction } from '../types/baseTypes'
import { getUserInfo, getUserSettings } from '../../api'
import { CleanUserSettings } from '../../types/userSettings'
import { minifySettings } from '../../helpers/settingsHelper'
import { updateSettings } from '../../api/settings'

export let getBaseInfo = (dispatch: Dispatch<BaseAction>): BaseAction => {
    getUserInfo()
        .then(res => dispatch({ type: "FETCH_USER_INFO", user: res }))

    getUserSettings()
        .then(res => dispatch({ type: "GET_USER_SETTINGS", settings: res }))

    return { type: "NONE" }
}

export let submitNewSettings = (dispatch: Dispatch<BaseAction>, newSettings: CleanUserSettings): BaseAction => {
    let minifiedSettings = minifySettings(newSettings)

    updateSettings(minifiedSettings)
        .then(cleanResult => dispatch({ type: "GET_USER_SETTINGS", settings: cleanResult }))

    return { type: "NONE" }
}