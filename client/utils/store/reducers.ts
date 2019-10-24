import { combineReducers, ReducersMapObject } from 'redux'

import { homeReducer } from './reducers/homeReducer'
import { recordsReducer } from './reducers/recordsReducer'
import { routerReducer } from './reducers/routerReducer'
import { sumOfRanksReducer } from './reducers/sumOfRanksReducer'
import { leaderboardCollectionReducer, leaderboardReducer } from './reducers/leaderboardReducer'
import { profileReducer } from './reducers/profileReducer'

const reducers: ReducersMapObject = {
    home: homeReducer,
    records: recordsReducer,
    routerInfo: routerReducer,
    sumOfRanks: sumOfRanksReducer,
    leaderboardCollection: leaderboardCollectionReducer,
    leaderboard: leaderboardReducer,
    profile: profileReducer
}

export let combineReducer = combineReducers(reducers)