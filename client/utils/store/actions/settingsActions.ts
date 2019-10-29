import { Dispatch } from 'redux'

import { SettingsAction } from '../types/settingsTypes'
import { CleanUserSettings } from '../../types/userSettings'

export let updateSettingsState = (newSettings: CleanUserSettings): SettingsAction => {
    return { type: "UPDATE_USER_SETTINGS_STATE", settings: newSettings }
}

export let updateExpandedPicker = (newPicker: string): SettingsAction => {
    return { type: "UPDATE_ACTIVE_COLOR_PICKER", newPicker: newPicker }
}