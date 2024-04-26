import {createSlice} from '@reduxjs/toolkit'

type time = {
    h:any,
    m:any,
    s:any,
    paused:boolean,
    over:boolean,
    maxValue:number,
}

const initialState:time  = {
    h: 0,
    m: 0,
    s:0,
    paused:true,
    over: false,
    maxValue:0,
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
    
    }
})

export const { setTimeH,setTimeM,setTimeS, setPaused, setOver, setMaxValue} = SearchRedux.actions;

export default SearchRedux.reducer