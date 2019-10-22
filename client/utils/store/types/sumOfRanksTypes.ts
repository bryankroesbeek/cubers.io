import { Action } from 'redux'

import { SumOfRanks } from '../../types'

export type SumOfRanksState = {
    eventRecords: SumOfRanks | "loading"
    type: string
}

export type SumOfRanksAction = Action<"NONE"> |
    Action<"FETCH_SUM_OF_RANKS"> & { ranks: SumOfRanks } |
    Action<"VIEW_SINGLE_SUM_OF_RANKS"> |
    Action<"VIEW_AVERAGE_SUM_OF_RANKS">
