export type PersonalRecord = {
    compId: number
    rank: number | ""
    username: string
    personal_best: string
    comp_id: number
    comp_title: string
    user_id: number
    comment: string,
    numerical_rank: string,
    user_is_verified: boolean,
}

export type EventRecords = {
    is_admin: boolean
    event_id: number
    singles: PersonalRecord[]
    averages: PersonalRecord[]
}