import React, { Fragment, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Provider, useSelector } from 'react-redux';
import store from '../Store/store';
import Loading from '../Components/loading';
import Authenticated from '../Guards/Auntications';
import Guest from '../Guards/guests';
import { combineSlices } from '@reduxjs/toolkit';

const Login = lazy(() => import('../Pages/login'));
const Dashboard = lazy(() => import('../Pages/Dashboard'));
const UMS = lazy(() => import('../Components/UMS/ums'));
const TMS = lazy(() => import('../Components/TMS/tms'));
const Reports = lazy(() => import('../Components/reports'));
const Profile = lazy(() => import('../Components/profile'));
const Sidebar = lazy(() => import('../Components/Sidebar/sidebar'));
const TopBar = lazy(() => import('../Components/topBar'));
const openTicket = lazy(() => import('../Components/TMS/openTicket'));
const createTicket = lazy(() => import('../Components/TMS/createTicket'));

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const routes = [
  {
    path: '/login',
    Guard: Guest,
    component: Login,
    exact: true,
  },
  {
    path: '/',
    Guard: Authenticated,
    component: Dashboard,
    exact: true,
  },
  {
    path: '/ums',
    Guard: Authenticated,
    role_name: 'ADMIN',
    component:UMS,
    exact: true,
  },
  {
    path: '/reports',
    Guard: Authenticated,
    component: Reports,
    exact: true,
  },
  {
    path: '/tms',
    Guard: Authenticated,
    component: TMS,
    exact: true,
  },
  {
    path: '/profile',
    Guard: Authenticated,
    component: Profile,
    exact: true,
  },
  {
    path: '/openTicket',
    Guard: Authenticated,
    component: openTicket,
    exact: true,
  },
  {
    path: '/createTicket',
    Guard: Authenticated,
    component: createTicket,
    exact: true,
  },
];

function RenderRoute() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderRoute = (route, index) => {
    const Component = route.component;
    const Guard = route.Guard;
    const role = route.role;

    if (role && user?.role !== role) {
      return null;
    }

    return (
      <Route
        key={index}
        path={route.path}
        exact={route.exact}
        element={
          <Guard>
            <Component />
          </Guard>
        }
      />
    );
  };

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <Box sx={{ display: 'flex' }}>
        <TopBar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
        <Sidebar 
          mobileOpen={mobileOpen}
          sidebarOpen={sidebarOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
        <Main open={sidebarOpen}>
          <DrawerHeader />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              {routes.map(renderRoute)}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </motion.div>
        </Main>
      </Box>
    </Suspense>
  );
}

// function App() {
//   const themeMode = useSelector((state) => state.theme.mode);
//   const theme = createTheme({
//     palette: {
//       mode: themeMode,
//       primary: {
//         main: '#90caf9',
//       },
//       secondary: {
//         main: '#f48fb1',
//       },
//       background: {
//         default: themeMode === 'dark' ? '#121212' : '#f5f5f5',
//         paper: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
//       },
//     },
//     typography: {
//       fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//     },
//   });

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Router>
//         <RenderRoute />
//       </Router>
//     </ThemeProvider>
//   );
// }

// export default function WrappedApp() {
//   return (
//     <Provider store={store}>
//       <App />
//     </Provider>
//   );
// }

export default RenderRoute;