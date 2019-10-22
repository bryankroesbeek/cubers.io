import { Action } from 'redux'

import { SumOfRanks } from '../../types'

export type SumOfRanksState = {
    eventRecords: SumOfRanks | "loading"
    type: string
}

export type SumOfRanksAction = Action<"NONE"> |
    Action<"FETCH_SUM_OF_RANKS"> & { ranks: SumOfRanks } |
    Action<"SET_SINGLE"> |
    Action<"SET_AVERAGE">
