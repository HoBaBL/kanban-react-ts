import { configureStore } from '@reduxjs/toolkit'
import  UserId  from './slice/UserId'
import numProd from './slice/numProd'
import UserName from './slice/userName'
import AllTask from './slice/AllTask'
import loading from './slice/loading'

export const store = configureStore({
    reducer: { UserId, numProd, UserName, AllTask, loading },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch