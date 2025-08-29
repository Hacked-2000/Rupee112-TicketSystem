import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tickets: [],
  total: 0,
  loading: false,
  error: null
}

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setTickets: (state, action) => {
      state.tickets = action.payload.data
      state.total = action.payload.meta?.total_items || 0
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { setTickets, setLoading, setError } = ticketSlice.actions
export default ticketSlice.reducer