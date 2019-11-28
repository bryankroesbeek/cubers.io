import { CommonUser } from "./common"

export type Leaderboard = {
    results: LeaderboardItem[],
    scrambles: string[]
}

export type LeaderboardItem = {
    rank: number,
    visibleRank: number
    solve: {
        average: number,
        best_single: number,
        times: string[],
        user: CommonUser
    },
}

export type LeaderboardData = {
    compTitle: string
    compId: number
    events: LeaderboardEvent[]
}

export type LeaderboardEvent = {
    compEventId: number,
    eventId: number,
    name: string,
    slug: string
}

export type LeaderboardsCollection = {
    currentComp: LeaderboardsCollectionCompetition,
    pastComps: LeaderboardsCollectionCompetition[]
}

export type LeaderboardsCollectionCompetition = {
    id: number,
    title: string,
    startDate: string,
    endDate: string
}