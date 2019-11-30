import { CommonUser } from "./common"

export type Leaderboard = {
    results: LeaderboardItem[],
    scrambles: string[]
}

export type LeaderboardItem = {
    rank: number,
    visibleRank: number
    solve: {
        id: number
        average: number
        best_single: number
        times: string[]
        comment: string
        blacklisted: boolean
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
    format: "Ao5" | "Mo3" | "Bo3" | "Bo1"
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