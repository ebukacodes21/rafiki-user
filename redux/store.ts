import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
    authReducer,
    firmReducer,
    initializeUserFromLocalStorage,
    initializeFirmFromLocalStorage
} from './features'

const reducer = combineReducers({
    authReducer,
    firmReducer,
})

export const store = configureStore({
    reducer,
})

store.dispatch(initializeUserFromLocalStorage())
store.dispatch(initializeFirmFromLocalStorage())

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch