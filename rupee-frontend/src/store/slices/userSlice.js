import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  users: [],
  total: 0,
  loading: false,
  error: null
}

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload.users
      state.total = action.payload.total
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { setUsers, setLoading, setError } = userSlice.actions
export default userSlice.reducer