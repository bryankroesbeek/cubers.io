import { combineReducers, ReducersMapObject } from 'redux'

import { homeReducer } from './reducers/homeReducer'
import { recordsReducer } from './reducers/recordsReducer'
import { routerReducer } from './reducers/routerReducer'
import { sumOfRanksReducer } from './reducers/sumOfRanksReducer'
import { leaderboardCollectionReducer } from './reducers/leaderboardReducer'

const reducers: ReducersMapObject = {
    home: homeReducer,
    records: recordsReducer,
    routerInfo: routerReducer,
    sumOfRanks: sumOfRanksReducer,
    leaderboardCollection: leaderboardCollectionReducer
}

export let combineReducer = combineReducers(reducers)