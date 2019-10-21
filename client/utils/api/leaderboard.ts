import { fetchResources } from './base'
import { Leaderboard, LeaderboardEvent, LeaderboardsCollection } from '../types'

export function getLeaderboardItems(compId: number): Promise<LeaderboardEvent[]> {
    return fetchResources<LeaderboardEvent[]>(`/api/leaderboards/comp/${compId}`)
}

export function getLeaderboardEvent(eventId: number): Promise<Leaderboard> {
    return fetchResources<Leaderboard>(`/api/leaderboards/event/${eventId}`)
}

export function getLeaderboardCompetitions(): Promise<LeaderboardsCollection> {
    return fetchResources<LeaderboardsCollection>('/api/leaderboards')
}