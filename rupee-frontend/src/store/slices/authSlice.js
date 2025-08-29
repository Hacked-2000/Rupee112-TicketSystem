import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { login as loginApi, getProtectedData } from '../../services/api'
import { jwtDecode } from 'jwt-decode'

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials)
      const { token } = response.data
      return token 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      if (!auth.token) return null
      
      const response = await getProtectedData()
      return response.user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Authentication failed')
    }
  }
)

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = null
        state.token = action.payload
        localStorage.setItem('token', action.payload)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
    
    // Check Auth
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false
        state.user = null
        state.token = null
        localStorage.removeItem('token')
        state.error = action.payload
      })
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer