export type ProfileRankings = {
    competitions: number
    kinchRanks: {
        all: string
        non_wca: string
        wca: string
    }
    medals: {
        bronze: number
        gold: number
        silver: number
    }
    solves: number
    sumOfRanks: {
        all: {
            average: number
            single: number
        }
        non_wca: {
            average: number
            single: number
        }
        wca: {
            average: number
            single: number
        }
    }
}

export type ProfileRecords = ProfileRecord[]

export type ProfileRecord = {
    average: number
    averageRank: number
    puzzle: string
    puzzleSlug: string
    single: number
    singleRank: number
    kinchRank: string
}

export type ProfileHistory = ProfileHistoryEvent[]

export type ProfileHistoryEvent = {
    event: string
    eventSlug: string
    results: ProfileHistoryResult[]
}

export type ProfileHistoryResult = {
    comp: ProfileHistoryComp
    solves: ProfileHistorySolves
}

export type ProfileHistorySolves = {
    id: number
    compEventId: number
    eventType: "normal" | "fmc" | "blind" | "multi_blind"
    single: number
    result: number
    average: number
    wasPbSingle: boolean
    wasPbAverage: boolean
    times: string[]
    comment: string
    medal: "bronze" | "silver" | "gold" | "none"
    isBlacklisted: boolean
    blacklistNote: string
}

export type ProfileHistoryComp = {
    id: number
    title: string
}

export type ProfileUser = {
    id: number
    name: string
    verified: boolean | "none"
    alwaysBlacklist: boolean | "none"
    admin: boolean | "none"
    resultsMod: boolean | "none"
}