import { CommonUser } from "./common"

export type KinchRanks = {
    title: string
    values: Rank[]
}

export type Rank = {
    rank_count: number,
    user: CommonUser
}