import { combineReducers, ReducersMapObject } from 'redux'

import { homeReducer } from './reducers/homeReducer'
import { recordsReducer } from './reducers/recordsReducer'
import { baseReducer } from './reducers/baseReducer'
import { sumOfRanksReducer } from './reducers/sumOfRanksReducer'
import { leaderboardCollectionReducer, leaderboardReducer } from './reducers/leaderboardReducer'
import { profileReducer } from './reducers/profileReducer'
import { versusReducer } from './reducers/versusReducer'
import { settingsReducer } from './reducers/settingsReducer'
import { competeReducer } from './reducers/competeReducer'
import { promptReducer } from './reducers/promptReducer'

const reducers: ReducersMapObject = {
    home: homeReducer,
    records: recordsReducer,
    baseInfo: baseReducer,
    sumOfRanks: sumOfRanksReducer,
    leaderboardCollection: leaderboardCollectionReducer,
    leaderboard: leaderboardReducer,
    profile: profileReducer,
    versus: versusReducer,
    settings: settingsReducer,
    compete: competeReducer,
    prompt: promptReducer
}

export let combineReducer = combineReducers(reducers)