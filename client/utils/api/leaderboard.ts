import { fetchResources, putResources } from './base'
import { Leaderboard, LeaderboardEvent, LeaderboardsCollection } from '../types'
import { LeaderboardData } from '../types/leaderboards'
import { LeaderboardTableRowOverall } from '../store/types/leaderboardTypes'

export function getLeaderboardItems(compId: number): Promise<LeaderboardData> {
    return fetchResources<LeaderboardData>(`/api/leaderboards/comp/${compId}`)
}

export function getLeaderboardOverall(compId: number): Promise<LeaderboardTableRowOverall[]> {
    return fetchResources(`/api/leaderboards/${compId}/overall`)
}

export function getLeaderboardEvent(eventId: number): Promise<Leaderboard> {
    return fetchResources<Leaderboard>(`/api/leaderboards/event/${eventId}`)
}

export function getLeaderboardCompetitions(): Promise<LeaderboardsCollection> {
    return fetchResources<LeaderboardsCollection>('/api/leaderboards')
}

export function setBlacklist(eventResultId: number, type: "blacklist" | "unblacklist"): Promise<any> {
    return putResources(`/api/${type}-result/${eventResultId}/`, null)
}