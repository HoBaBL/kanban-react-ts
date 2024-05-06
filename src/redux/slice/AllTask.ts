import {createSlice} from '@reduxjs/toolkit'

const initialState  = {
    changes: 1
}

const SearchRedux = createSlice({
    name: 'changes',
    initialState,
    reducers: {
        setСhanges(state, action) {
            state.changes = action.payload
        }
    }
})

export const { setСhanges } = SearchRedux.actions;

export default SearchRedux.reducer