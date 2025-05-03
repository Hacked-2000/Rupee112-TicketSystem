import React from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  styled 
} from '@mui/material';
import { 
  People as PeopleIcon,
  Assignment as TicketIcon,
  Assessment as ReportIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const mappedRole = (role_id) => {
    switch (role_id) {
      case 1: return 'admin';
      case 2: return 'user';
      default: return 'guest';
    }
  };
  const userRole = mappedRole(user?.role_id);

  const stats = [
    {
      title: userRole === 'admin' ? 'Users' : 'My Tickets',
      value: userRole === 'admin' ? '24' : '5',
      icon: userRole === 'admin' ? <PeopleIcon fontSize="large" /> : <TicketIcon fontSize="large" />,
      color: 'primary',
    },
    {
      title: 'Open Tickets',
      value: '12',
      icon: <TicketIcon fontSize="large" />,
      color: 'secondary',
    },
    {
      title: 'Reports',
      value: '8',
      icon: <ReportIcon fontSize="large" />,
      color: 'success',
    },
  ];

  return (
    <>
    <ToastContainer position="top-right" autoClose={1000} />
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {user?.role === 'admin' 
          ? 'You have administrator privileges' 
          : 'Here are your recent activities'}
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Item elevation={3}>
                <Box sx={{ color: `${stat.color}.main`, mb: 1 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h5" component="div">
                  {stat.value}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {stat.title}
                </Typography>
              </Item>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user?.role === 'admin' 
              ? 'System updates and user activities will appear here.'
              : 'Your recent ticket updates will appear here.'}
          </Typography>
        </Paper>
      </motion.div>
    </Box>
    </>
  );
};

export default Dashboard;