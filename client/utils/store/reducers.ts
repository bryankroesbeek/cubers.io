import { combineReducers, ReducersMapObject } from 'redux'

import { homeReducer } from './reducers/homeReducer'

const reducers: ReducersMapObject = {
    home: homeReducer
}

export let combineReducer = combineReducers(reducers)