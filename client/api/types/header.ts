export type HeaderInfo = {
    title: string
    recordsItems: Record
    leaderboardItems: Leaderboard
    userItems: UserItems
}

export type Record = {
    wca: HeaderItem
    nonWca: HeaderItem
    sum: HeaderItem
}

export type Leaderboard = {
    current: DetailedUrl
    previous: DetailedUrl
    all: DetailedUrl
}

export type UserItems = {
    logout_url: string
    profile_url: string
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
}