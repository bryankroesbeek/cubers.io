import { createStore } from 'redux'

import { combineReducer } from './reducers'

export let store = createStore(combineReducer)