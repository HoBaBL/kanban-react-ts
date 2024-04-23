import {createSlice} from '@reduxjs/toolkit'

const initialState  = {
    loading: []
}

const SearchRedux = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload
        }
    }
})

export const { setLoading } = SearchRedux.actions;

export default SearchRedux.reducer