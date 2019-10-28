import { Action } from 'redux'

import { ProfileRankings, ProfileRecords } from "../../types/profile"
import { ProfileAction } from './profileTypes'

export type VersusState = {
    user1Rankings: ProfileRankings | "loading"
    user2Rankings: ProfileRankings | "loading"

    user1Records: ProfileRecords | "loading"
    user2Records: ProfileRecords | "loading"
}

export type VersusAction = Action<"NONE"> |
    Action<"FETCH_PROFILE_1_STATISTICS"> & { user1Rankings: ProfileRankings } |
    Action<"FETCH_PROFILE_1_RECORDS"> & { user1Records: ProfileRecords } |
    Action<"FETCH_PROFILE_2_STATISTICS"> & { user2Rankings: ProfileRankings } |
    Action<"FETCH_PROFILE_2_RECORDS"> & { user2Records: ProfileRecords } 