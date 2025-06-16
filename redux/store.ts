import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
    firmReducer,
    initializeFirmFromLocalStorage
} from './features'

const reducer = combineReducers({
    firmReducer,
})

export const store = configureStore({
    reducer,
})

store.dispatch(initializeFirmFromLocalStorage())

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch