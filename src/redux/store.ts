import { configureStore } from '@reduxjs/toolkit'
import  UserId  from './slice/UserId'
import numProd from './slice/numProd'

export const store = configureStore({
    reducer: { UserId, numProd },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch