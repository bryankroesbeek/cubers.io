import { fetchResources, postResources } from './base'
import { ProfileRankings, ProfileRecords, ProfileHistory } from '../types'
import { CommonUser } from '../types/common'
import { ProfileUser } from '../types/profile'

export function getUserRankings(username: string): Promise<ProfileRankings> {
    return fetchResources<ProfileRankings>(`/api/user/${username}/rankings`)
}

export function getUserRecords(username: string): Promise<ProfileRecords> {
    return fetchResources<ProfileRecords>(`/api/user/${username}/records`)
}

export function getUserHistory(username: string) {
    return fetchResources<ProfileHistory>(`/api/user/${username}/history`)
}

export function getUserInformation(username: string): Promise<ProfileUser> {
    return fetchResources<ProfileUser>(`/api/user/${username}`)
}

export function setVerifiedStatus<T>(username: string, status: "verify" | "unverify"): Promise<T> {
    return postResources(`/api/${status}-user/${username}`, null)
}

export function setBlacklistStatus<T>(username: string, status: "blacklist" | "unblacklist"): Promise<T> {
    return postResources(`/api/${status}-user/${username}`, null)
}