import { Dispatch } from 'redux'

import { RecordsAction } from '../types/recordsTypes'
import { getRecords } from '../../api'

export let fetchCompetitionEvents = (dispatch: Dispatch<RecordsAction>, event: string, type: "single" | "average"): RecordsAction => {
    getRecords(event, type)
        .then(result => dispatch({ type: "FETCH_RECORDS", payload: result }))

    return { type: "NONE" }
}

export let setSingle = (): RecordsAction => {
    return { type: "VIEW_SINGLE_RECORDS" }
}

export let setAverage = (): RecordsAction => {
    return { type: "VIEW_AVERAGE_RECORDS" }
}