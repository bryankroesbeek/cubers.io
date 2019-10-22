import { Dispatch } from 'redux'

import { SumOfRanksAction } from '../types/sumOfRanksTypes'
import { getSumOfRanks } from '../../api'

export let fetchSumOfRanks = (dispatch: Dispatch<SumOfRanksAction>, type: string): SumOfRanksAction => {
    getSumOfRanks(type)
        .then(result => dispatch({ type: "FETCH_SUM_OF_RANKS", ranks: result }))

    return { type: "NONE" }
}

export let setSingle = (): SumOfRanksAction => {
    return { type: "VIEW_SINGLE_SUM_OF_RANKS" }
}

export let setAverage = (): SumOfRanksAction => {
    return { type: "VIEW_AVERAGE_SUM_OF_RANKS" }
}