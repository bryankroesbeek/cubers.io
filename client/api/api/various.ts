import { fetchResources } from './base'
import { EventRecords, SumOfRanks } from '../types'

export function getRecords(event: string, type: "single" | "average"): Promise<EventRecords> {
    return fetchResources<EventRecords>(`/api/records/${event}`)
}

export function getSumOfRanks(type: string): Promise<SumOfRanks> {
    return fetchResources<SumOfRanks>(`/api/sum-of-ranks/${type}`)
}

export function getUsernames(usernameSection: string) {
    return fetchResources<string[]>(`/api/matching-usernames?section=${usernameSection}`)
}