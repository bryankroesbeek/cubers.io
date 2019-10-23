import { combineReducers, ReducersMapObject } from 'redux'

import { homeReducer } from './reducers/homeReducer'
import { recordsReducer } from './reducers/recordsReducer'
import { routerReducer } from './reducers/routerReducer'
import { sumOfRanksReducer } from './reducers/sumOfRanksReducer'
import { leaderboardCollectionReducer, leaderboardReducer } from './reducers/leaderboardReducer'

const reducers: ReducersMapObject = {
    home: homeReducer,
    records: recordsReducer,
    routerInfo: routerReducer,
    sumOfRanks: sumOfRanksReducer,
    leaderboardCollection: leaderboardCollectionReducer,
    leaderboard: leaderboardReducer
}

export let combineReducer = combineReducers(reducers)