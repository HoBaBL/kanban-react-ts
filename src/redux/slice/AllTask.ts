import {createSlice} from '@reduxjs/toolkit'

const initialState  = {
    AllTask: []
}

const SearchRedux = createSlice({
    name: 'AllTask',
    initialState,
    reducers: {
        setAllTask(state, action) {
            state.AllTask = action.payload
        }
    }
})

export const { setAllTask } = SearchRedux.actions;

export default SearchRedux.reducer