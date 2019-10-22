import { combineReducers, ReducersMapObject } from 'redux'

import { homeReducer } from './reducers/homeReducer'
import { routerReducer } from './reducers/routerReducer'

const reducers: ReducersMapObject = {
    home: homeReducer,
    routerInfo: routerReducer
}

export let combineReducer = combineReducers(reducers)