import {createSlice} from '@reduxjs/toolkit'

type time = {
    h:any,
    m:any,
    s:any,
    paused:boolean,
    over:boolean,
    maxValue:number,
    check:boolean
}

const initialState:time  = {
    h: sessionStorage.getItem('hrs') || 0,
    m: sessionStorage.getItem('min') || 0,
    s: sessionStorage.getItem('sec') || 0,
    paused:true,
    over: false,
    maxValue:0,
    check:true
}

const SearchRedux = createSlice({
    name: 'numProd',
    initialState,
    reducers: {
        setTimeH(state, action) {
            state.h = action.payload
        },
        setTimeM(state, action) {
            state.m = action.payload
        },
        setTimeS(state, action) {
            state.s = action.payload
        },
        setPaused(state, action) {
            state.paused = action.payload
        },
        setOver(state, action) {
            state.over = action.payload
        },
        setMaxValue(state, action) {
            state.maxValue = action.payload
        },
        setCheck(state, action) {
            state.check = action.payload
        },
    
    }
})

export const { setTimeH,setTimeM,setTimeS, setPaused, setOver, setMaxValue, setCheck} = SearchRedux.actions;

export default SearchRedux.reducer