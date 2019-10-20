import { fetchResources, postResources, putResources, deleteResources } from './base'
import { Event, CompetitionEvent } from '../types'

export function postSolve(time: {
    is_inspection_dnf: boolean
    is_dnf: boolean
    is_plus_two: boolean
    scramble_id: number
    comp_event_id: number
    elapsed_centiseconds: number
}): Promise<Event> {
    return postResources('/api/submit-solve', time)
}

export function putDnf(solveId: number, compEventId: number): Promise<Event> {
    return putResources('/api/submit-penalty', {
        solve_id: solveId,
        comp_event_id: compEventId,
        penalty_to_toggle: "penalty_dnf"
    })
}

export function putPlusTwo(solveId: number, compEventId: number): Promise<Event> {
    return putResources('/api/submit-penalty', {
        solve_id: solveId,
        comp_event_id: compEventId,
        penalty_to_toggle: "penalty_plus_two"
    })
}

export function putClearPenalty(solveId: number, compEventId: number): Promise<Event> {
    return putResources('/api/submit-penalty', {
        solve_id: solveId,
        comp_event_id: compEventId,
        penalty_to_toggle: "penalty_clear"
    })
}

export function deleteSolve(solveId: number, compEventId: number): Promise<Event> {
    return deleteResources('/api/delete-solve', {
        solve_id: solveId,
        comp_event_id: compEventId
    })
}

export function submitComment(compEventId: number, comment: string): Promise<Event> {
    return putResources('/api/submit-comment', {
        comp_event_id: compEventId,
        comment: comment
    })
}

export function getCompetitionEvents(): Promise<CompetitionEvent[]> {
    return fetchResources("/api/competition-events")
}

export function getEventInfo(eventId: number): Promise<Event> {
    return fetchResources(`/api/get-event/${eventId}`)
}