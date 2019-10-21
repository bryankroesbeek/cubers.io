import { fetchResources } from './base'
import { ProfileRankings, ProfileRecords, ProfileHistory } from '../types'

export function getUserRankings(username: string): Promise<ProfileRankings> {
    return fetchResources<ProfileRankings>(`/api/user/${username}/rankings`)
}

export function getUserRecords(username: string): Promise<ProfileRecords> {
    return fetchResources<ProfileRecords>(`/api/user/${username}/records`)
}

export function getUserHistory(username: string) {
    return fetchResources<ProfileHistory>(`/api/user/${username}/history`)
}