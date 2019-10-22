import { combineReducers, ReducersMapObject } from 'redux'

import { homeReducer } from './reducers/homeReducer'
import { recordsReducer } from './reducers/recordsReducer'
import { routerReducer } from './reducers/routerReducer'

const reducers: ReducersMapObject = {
    home: homeReducer,
    records: recordsReducer,
    routerInfo: routerReducer
}

export let combineReducer = combineReducers(reducers)