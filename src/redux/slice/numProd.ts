import {createSlice} from '@reduxjs/toolkit'

const initialState  = {
    numProd: 0
}

const SearchRedux = createSlice({
    name: 'numProd',
    initialState,
    reducers: {
        setnumProd(state, action) {
            state.numProd = action.payload
        }
    }
})

export const { setnumProd } = SearchRedux.actions;

export default SearchRedux.reducer