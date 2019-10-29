import { combineReducers, ReducersMapObject } from 'redux'

import { homeReducer } from './reducers/homeReducer'
import { recordsReducer } from './reducers/recordsReducer'
import { baseReducer } from './reducers/baseReducer'
import { sumOfRanksReducer } from './reducers/sumOfRanksReducer'
import { leaderboardCollectionReducer, leaderboardReducer } from './reducers/leaderboardReducer'
import { profileReducer } from './reducers/profileReducer'
import { versusReducer } from './reducers/versusReducer'

const reducers: ReducersMapObject = {
    home: homeReducer,
    records: recordsReducer,
    baseInfo: baseReducer,
    sumOfRanks: sumOfRanksReducer,
    leaderboardCollection: leaderboardCollectionReducer,
    leaderboard: leaderboardReducer,
    profile: profileReducer,
    versus: versusReducer
}

export let combineReducer = combineReducers(reducers)