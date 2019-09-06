export type SumOfRanks = {
    title: string
    averages: Rank[]
    singles: Rank[]
}

export type Rank = {
    rank_count: number,
        user: {
            id: number,
            name: string,
            verified: boolean
        }
}