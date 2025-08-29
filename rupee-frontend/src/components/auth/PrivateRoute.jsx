import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, loading } = useAuth()
  const location = useLocation()
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  // If user is not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  // If specific roles are required and user doesn't have permission
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role_id)) {
    return <Navigate to="/dashboard" replace />
  }
  
  // User is authenticated and has permission
  return children
}

export default PrivateRoute