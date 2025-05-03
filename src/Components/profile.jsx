import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  AssignmentInd as RoleIcon,
  CalendarToday as DateIcon,
  Lock as PasswordIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 2,
                    bgcolor: 'primary.main',
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
                <Typography variant="h5">{user?.name}</Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {user?.role === 'admin' ? 'Administrator' : 'User'}
                </Typography>
                
                <Button variant="outlined" sx={{ mt: 2 }}>
                  Change Avatar
                </Button>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText primary="Email" secondary={user?.email} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <RoleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Role" secondary={user?.role} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DateIcon />
                  </ListItemIcon>
                  <ListItemText primary="Member since" secondary="May 2023" />
                </ListItem>
              </List>
            </Paper>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Account Settings
            </Typography>
            
            <Box component="form" sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    defaultValue={user?.name}
                    InputProps={{
                      startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    defaultValue={user?.email}
                    InputProps={{
                      startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    InputProps={{
                      startAdornment: <PasswordIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Button variant="contained">
                        Save Changes
                      </Button>
                    </motion.div>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;