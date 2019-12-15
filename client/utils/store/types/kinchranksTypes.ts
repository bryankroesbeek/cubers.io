import { Action } from 'redux'

import { KinchRanks } from '../../types/kinchRanks'

export type KinchranksState = {
    eventRecords: KinchRanks | "loading"
}

export type KinchranksAction = Action<"NONE"> |
    Action<"FETCH_KINCHRANKS"> & { ranks: KinchRanks }
