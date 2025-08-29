import React, { createContext, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { checkAuth, login, logout } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector(state => state.auth)

  const loginUser = async (credentials) => {
    try {
      const result = await dispatch(login(credentials)).unwrap()
     
      const check=await dispatch(checkAuth())
      console.log(result)
      console.log(check)
      return !!check.payload?.id
    } catch (error) {
      return false
    }
  }
const navigate=useNavigate()
  const logoutUser = () => {
    navigate('/')
    dispatch(logout())
  }

  const value = {
    currentUser: user,
    loading,
    error,
    loginUser,
    logout: logoutUser,
    isAdmin: user?.role_id === 3,
    isManager: user?.role_id === 2,
    isSupport: user?.role_id === 1,
    isAgent: user?.role_id === 4
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
 
        
