import { postResources, fetchResources } from './base'
import { UserSettings, UserSettingsMinified } from '../types'


export function getUserSettings(): Promise<UserSettings> {
    return fetchResources('/api/user-settings')
}

export function updateSettings(settings: UserSettingsMinified): Promise<UserSettings> {
    return postResources<UserSettings>('/api/update-settings', settings)
}