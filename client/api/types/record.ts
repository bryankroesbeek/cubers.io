export type PersonalRecord = {
    compId: number
    rank: number | ""
    username: string
    single: string
    average: string
    competition: {
        name: string
        url: string
    }
}