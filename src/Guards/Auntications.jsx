import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const Authenticated = ({children}) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
   console.log(isAuthenticated)
   
  return isAuthenticated ? children: <Navigate to="/login" />;
};

export default Authenticated;