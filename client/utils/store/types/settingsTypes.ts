import { Reducer, Action } from 'redux'

import { UserSettings, User } from '../../types'
import { CleanUserSettings } from '../../types/userSettings'

export type UserSettingsState = {
    settings: CleanUserSettings
    expandedOption: string
}


export type SettingsAction = Action<"NONE"> |
    Action<"GET_USER_SETTINGS"> & { settings: UserSettings } |
    Action<"UPDATE_USER_SETTINGS_STATE"> & { settings: CleanUserSettings } |
    Action<"UPDATE_ACTIVE_COLOR_PICKER"> & { newPicker: string }