import { Reducer, Action } from 'redux'

import { SettingsAction, UserSettingsState } from '../types/settingsTypes'

const initialState: UserSettingsState = {
    expandedOption: null,
    settings: null
}

export const settingsReducer: Reducer<UserSettingsState, SettingsAction> = (state = initialState, action): UserSettingsState => {
    switch (action.type) {
        case "UPDATE_USER_SETTINGS_STATE":
            return { ...state, settings: action.settings }

        case "UPDATE_ACTIVE_COLOR_PICKER":
            return { ...state, expandedOption: action.newPicker }
    }

    return state
}