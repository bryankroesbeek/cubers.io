import { Dispatch } from 'redux'

import { SumOfRanksAction } from '../types/sumOfRanksTypes'
import { getSumOfRanks } from '../../api'

export let fetchSumOfRanks = (dispatch: Dispatch<SumOfRanksAction>, type: string): SumOfRanksAction => {
    getSumOfRanks(type)
        .then(result => dispatch({ type: "FETCH_SUM_OF_RANKS", ranks: result }))

    return { type: "NONE" }
}

export let setSingle = (): SumOfRanksAction => {
    return { type: "SET_SINGLE" }
}

export let setAverage = (): SumOfRanksAction => {
    return { type: "SET_AVERAGE" }
}