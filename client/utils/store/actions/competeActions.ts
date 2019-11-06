import { Dispatch } from 'redux'

import { CompeteState, CompeteAction } from '../types/competeTypes'
import { getEventInfo, postSolve, putDnf, putPlusTwo, deleteSolve } from '../../api/compete'
import { Event } from '../../types/event'


export function fetchEvent(event: Event): CompeteAction {
    return { type: "FETCH_EVENT", event: event }
}

export function submitSolve(dispatch: Dispatch<CompeteAction>, event: Event, timeInMilliseconds: number, penalty: "none" | "+2" | "DNF") {
    postSolve({
        comp_event_id: event.event.id,
        elapsed_centiseconds: parseInt(`${timeInMilliseconds / 10}`),
        is_inspection_dnf: penalty === "DNF",
        is_dnf: penalty === "DNF",
        is_plus_two: penalty === "+2",
        scramble_id: event.currentScramble.id
    }).then(newEvent => dispatch({ type: "FETCH_EVENT", event: newEvent }))
}

export function submitPenalty(dispatch: Dispatch<CompeteAction>, event: Event, id: number, penalty: "none" | "+2" | "DNF") {
    if (penalty === "+2") {
        putPlusTwo(id, event.event.id)
            .then(newEvent => dispatch({ type: "FETCH_EVENT", event: newEvent }))
    }
    if (penalty === "DNF") {
        putDnf(id, event.event.id)
            .then(newEvent => dispatch({ type: "FETCH_EVENT", event: newEvent }))
    }
    }

export function deleteSolveAction(dispatch: Dispatch<CompeteAction>, event: Event, id: number) {
    deleteSolve(id, event.event.id)
        .then(newEvent => dispatch({ type: "FETCH_EVENT", event: newEvent }))
}