import {createSlice} from '@reduxjs/toolkit'

const initialState  = {
    UserName: ''
}

const SearchRedux = createSlice({
    name: 'UserName',
    initialState,
    reducers: {
        setUserName(state, action) {
            state.UserName = action.payload
        }
    }
})

export const { setUserName } = SearchRedux.actions;

export default SearchRedux.reducer