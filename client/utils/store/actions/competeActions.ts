import { Dispatch } from 'redux'

import { CompeteState, CompeteAction } from '../types/competeTypes'
import { getEventInfo, postSolve, putDnf, putPlusTwo, deleteSolve, putClearPenalty } from '../../api/compete'
import { Event } from '../../types/event'


export function fetchEvent(event: Event): CompeteAction {
    return { type: "FETCH_EVENT", event: event }
}

export function submitSolve(dispatch: Dispatch<CompeteAction>, event: Event, timeInCentiseconds: number, penalty: "none" | "+2" | "DNF", callback: () => void) {
    postSolve({
        comp_event_id: event.event.id,
        elapsed_centiseconds: parseInt(`${timeInCentiseconds}`),
        is_inspection_dnf: penalty === "DNF",
        is_dnf: penalty === "DNF",
        is_plus_two: penalty === "+2",
        scramble_id: event.currentScramble.id
    })
        .then(newEvent => dispatch({ type: "FETCH_EVENT", event: newEvent }))
        .then(() => callback())
}

export function submitFmcResult(dispatch: Dispatch<CompeteAction>, event: Event, moveCount: number, solution: string, dnf: boolean, callback: () => void) {
    postSolve({
        comp_event_id: event.event.id,
        elapsed_centiseconds: moveCount * 100,
        is_dnf: dnf,
        is_plus_two: false,
        is_inspection_dnf: false,
        scramble_id: event.currentScramble.id,
        fmc_comment: solution
    })
        .then(newEvent => dispatch({ type: "FETCH_EVENT", event: newEvent }))
        .then(() => callback())
}

export function submitPenalty(dispatch: Dispatch<CompeteAction>, event: Event, id: number, penalty: "none" | "+2" | "DNF", callback: () => void) {
    if (penalty === "+2") {
        var request = putPlusTwo(id, event.event.id)
    }
    if (penalty === "DNF") {
        var request = putDnf(id, event.event.id)
    }
    if (penalty === "none") {
        var request = putClearPenalty(id, event.event.id)
    }
    request
        .then(newEvent => dispatch({ type: "FETCH_EVENT", event: newEvent }))
        .then(() => callback())
}

export function deleteSolveAction(dispatch: Dispatch<CompeteAction>, event: Event, id: number, callback: () => void) {
    deleteSolve(id, event.event.id)
        .then(newEvent => dispatch({ type: "FETCH_EVENT", event: newEvent }))
        .then(() => callback())
}