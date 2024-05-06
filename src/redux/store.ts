import { configureStore } from '@reduxjs/toolkit'
import  UserId  from './slice/UserId'
import numProd from './slice/numProd'
import UserName from './slice/userName'
import changes from './slice/AllTask'
import loading from './slice/loading'
import h from './slice/pomodoro'
import m from './slice/pomodoro'
import s from './slice/pomodoro'
import paused from './slice/pomodoro'
import over from './slice/pomodoro'
import maxValue from './slice/pomodoro'
import check  from './slice/pomodoro'

export const store = configureStore({
    reducer: { UserId, numProd, UserName, changes, loading, h, m, s, paused, over, maxValue, check },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch