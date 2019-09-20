import * as types from './types'
import * as helpers from './helpers/settingsHelper'

let getHeaders = (): Headers => {
    let token = document.getElementsByName('Anti-Forgery-Token')[0].getAttribute('value')
    let headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append('X_CSRF_TOKEN', token)

    return headers
}

function fetchResources<T>(url: string): Promise<T> {
    return fetch(url)
        .then(res => res.json())
        .then(json => json as T)
}

function sendResources<T>(url: string, data: any, method: "POST" | "PUT" | "DELETE") {
    let request: RequestInit = {
        method: method,
        headers: getHeaders(),
    }

    if (!!data) request.body = JSON.stringify(data)

    return fetch(url, request)
        .then(res => res.json())
        .then(json => json as T)
}

function postResources<T>(url: string, data: any): Promise<T> {
    return sendResources<T>(url, data, "POST")
}

function putResources<T>(url: string, data: any): Promise<T> {
    return sendResources<T>(url, data, "PUT")
}

function deleteResources<T>(url: string, data: any): Promise<T> {
    return sendResources<T>(url, data, "DELETE")
}

export function getUserSettings(): Promise<types.UserSettings> {
    return fetchResources('/api/user-settings')
}

export function getUserInfo(): Promise<types.User> {
    return fetchResources('/api/user-info')
}

export function getHeaderInfo(): Promise<types.HeaderInfo> {
    return fetchResources("/api/header-info")
}

export function getCompetitionEvents(): Promise<types.CompetitionEvent[]> {
    return fetchResources("/api/competition-events")
}

export function getEventInfo(eventId: number): Promise<types.Event> {
    return fetchResources(`/api/get-event/${eventId}`)
}

export function postSolve(time: {
    is_inspection_dnf: boolean
    is_dnf: boolean
    is_plus_two: boolean
    scramble_id: number
    comp_event_id: number
    elapsed_centiseconds: number
}): Promise<types.Event> {
    return postResources('/api/submit-solve', time)
}

export function putDnf(solveId: number, compEventId: number): Promise<types.Event> {
    return putResources('/api/submit-penalty', {
        solve_id: solveId,
        comp_event_id: compEventId,
        penalty_to_toggle: "penalty_dnf"
    })
}

export function putPlusTwo(solveId: number, compEventId: number): Promise<types.Event> {
    return putResources('/api/submit-penalty', {
        solve_id: solveId,
        comp_event_id: compEventId,
        penalty_to_toggle: "penalty_plus_two"
    })
}

export function putClearPenalty(solveId: number, compEventId: number): Promise<types.Event> {
    return putResources('/api/submit-penalty', {
        solve_id: solveId,
        comp_event_id: compEventId,
        penalty_to_toggle: "penalty_clear"
    })
}

export function deleteSolve(solveId: number, compEventId: number): Promise<types.Event> {
    return deleteResources('/api/delete-solve', {
        solve_id: solveId,
        comp_event_id: compEventId
    })
}

export function submitComment(compEventId: number, comment: string): Promise<types.Event> {
    return putResources('/api/submit-comment', {
        comp_event_id: compEventId,
        comment: comment
    })
}

export function updateSettings(settings: types.UserSettingsMinified): Promise<types.UserSettings> {
    return postResources<types.UserSettings>('/api/update-settings', settings)
}

export function getRecords(event: string, type: "single" | "average"): Promise<types.EventRecords> {
    return fetchResources<types.EventRecords>(`/api/records/${event}`)
}

export function getSumOfRanks(type: string): Promise<types.SumOfRanks> {
    return fetchResources<types.SumOfRanks>(`/api/sum-of-ranks/${type}`)
}

export function getLeaderboardItems(compId: number): Promise<types.LeaderboardEvent[]> {
    return fetchResources<types.LeaderboardEvent[]>(`/api/leaderboards/comp/${compId}`)
}

export function getLeaderboardEvent(eventId: number): Promise<types.Leaderboard> {
    return fetchResources<types.Leaderboard>(`/api/leaderboards/event/${eventId}`)
}

export function getLeaderboardCompetitions(): Promise<types.LeaderboardsCollection> {
    return fetchResources<types.LeaderboardsCollection>('/api/leaderboards')
}