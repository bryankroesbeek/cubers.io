export type HeaderInfo = {
    title: string
    recordsItems: Record
    leaderboardItems: LeaderboardHeaderItem
    userItems: UserItems
}

export type Record = {
    wca: HeaderItem
    nonWca: HeaderItem
    sum: HeaderItem
    kinchranks: HeaderItem
}

export type LeaderboardHeaderItem = {
    current: DetailedUrl
    previous: DetailedUrl
    all: DetailedUrl
}

export type UserItems = {
    logout_url: string
    profile_url: string
    versus_url: string
    settings_url: string
} | "none"

export type HeaderItem = {
    title: string
    urls: DetailedUrl[]
}

export type DetailedUrl = {
    url: string
    name: string
}

export type User = {
    name: string
    id: number
    admin: boolean
    mod: boolean
}