export type PersonalRecord = {
    compId: number
    rank: number | ""
    username: string
    personal_best: string
    comp_id: number
    comp_title: string
}

export type EventRecords = {
    is_admin: boolean
    event_id: number
    solves: PersonalRecord[]
}