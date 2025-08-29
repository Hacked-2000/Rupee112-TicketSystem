import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Layout from './components/layout/Layout'
import { checkAuth } from './store/slices/authSlice'
import { AuthProvider } from './context/AuthContext'
import LoadingSpinner from './components/common/LoadingSpinner'

// Lazy-loaded pages
const LoginPage = lazy(() => import('./pages/LoginPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const TicketsPage = lazy(() => import('./pages/TicketsPage'))
const TicketDetailsPage = lazy(() => import('./pages/TicketDetailsPage'))
const CreateTicketPage = lazy(() => import('./pages/CreateTicketPage'))
const UsersPage = lazy(() => import('./pages/UsersPage'))
const CreateUserPage = lazy(() => import('./pages/CreateUserPage'))
const EditUserPage = lazy(() => import('./pages/EditUserPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const ReportsPage = lazy(() => import('./pages/ReportsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function App() {
  const dispatch = useDispatch()
  const { loading, user } = useSelector(state => state.auth)
  
  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])
  
  if (loading) {
    return <LoadingSpinner/>
  }
  
  return (
    <Suspense fallback={<LoadingSpinner/>}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/dashboard" element={
              user ? <DashboardPage /> : <Navigate to="/login" />
            } />
            
            <Route path="/tickets" element={
              user ? <TicketsPage /> : <Navigate to="/login" />
            } />
            
            <Route path="/tickets/create" element={
              user && [2, 4].includes(user.role_id) ? 
                <CreateTicketPage /> : <Navigate to="/dashboard" />
            } />
            
            <Route path="/tickets/:id" element={
              user ? <TicketDetailsPage /> : <Navigate to="/login" />
            } />
            
            <Route path="/users" element={
            <UsersPage /> 
            } />
            
            <Route path="/users/create" element={
              user && user.role_id === 3 ? <CreateUserPage /> : <Navigate to="/dashboard" />
            } />
            
            <Route path="/users/edit" element={
              user && user.role_id === 3 ? <EditUserPage /> : <Navigate to="/dashboard" />
            } />
            
            <Route path="/reports" element={
              user && [3,2].includes(user.role_id) ? 
                <ReportsPage /> : <Navigate to="/dashboard" />
            } />
            
            <Route path="/profile" element={
              user ? <ProfilePage /> : <Navigate to="/login" />
            } />
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Suspense>
  )
}

export default App