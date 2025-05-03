import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const Guest = ({children}) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  return !isAuthenticated ? children : <Navigate to="/" />;
};

export default Guest;