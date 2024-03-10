import {createSlice} from '@reduxjs/toolkit'

const initialState  = {
    UserId: ''
}

const SearchRedux = createSlice({
    name: 'UserId',
    initialState,
    reducers: {
        setUserId(state, action) {
            state.UserId = action.payload
        }
    }
})

export const { setUserId } = SearchRedux.actions;

export default SearchRedux.reducer