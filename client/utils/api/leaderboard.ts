import { fetchResources } from './base'
import { Leaderboard, LeaderboardEvent, LeaderboardsCollection } from '../types'
import { LeaderboardData } from '../types/leaderboards'

export function getLeaderboardItems(compId: number): Promise<LeaderboardData> {
    return fetchResources<LeaderboardData>(`/api/leaderboards/comp/${compId}`)
}

export function getLeaderboardEvent(eventId: number): Promise<Leaderboard> {
    return fetchResources<Leaderboard>(`/api/leaderboards/event/${eventId}`)
}

export function getLeaderboardCompetitions(): Promise<LeaderboardsCollection> {
    return fetchResources<LeaderboardsCollection>('/api/leaderboards')
}