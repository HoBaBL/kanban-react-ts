import { configureStore } from '@reduxjs/toolkit'
import  UserId  from './slice/UserId'

export const store = configureStore({
    reducer: { UserId },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch