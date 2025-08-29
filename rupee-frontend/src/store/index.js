import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import ticketReducer from './slices/ticketSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    tickets: ticketReducer
  }
})

export const getState = store.getState
export const dispatch = store.dispatch