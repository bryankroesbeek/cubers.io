import { Dispatch } from 'redux'

import { LeaderboardCollectionAction } from '../types/leaderboardTypes'
import { getLeaderboardCompetitions } from '../../api'

export let fetchLeaderboardCollection = (dispatch: Dispatch<LeaderboardCollectionAction>): LeaderboardCollectionAction => {
    getLeaderboardCompetitions()
        .then(result => dispatch({ type: "FETCH_ALL_LEADERBOARD_COMPETITIONS", collection: result }))

    return { type: "NONE" }
}