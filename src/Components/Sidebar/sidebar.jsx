import React from 'react';
import { useSelector } from 'react-redux';
import { styled, useTheme } from '@mui/material/styles';
import { 
  Drawer, 
  List, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Avatar, 
  Typography,
  Box 
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as TicketIcon,
  Assessment as ReportsIcon,
  AccountCircle as ProfileIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import SidebarItem from './sidebarItems';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Sidebar = ({ mobileOpen, sidebarOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const themeMode = useSelector((state) => state.theme.mode);
  console.log(user.protected.user);
  

  const mappedRole = (role_id) => {
    switch (role_id) {
      case 3: return 'ADMIN';
      case 2: return 'USER';
      default: return 'guest';
    }
  };
  const userRole = mappedRole(user?.role_id);

  const drawer = (
    <div>
      <DrawerHeader>
        <IconButton onClick={handleDrawerToggle}>
          {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Avatar 
            sx={{ 
              width: 64, 
              height: 64,
              mb: 1,
              bgcolor: theme.palette.secondary.main,
            }}
          >
            {user?.protected.user?.role_name?.charAt(0) || 'U'}
          </Avatar>
        </motion.div>
        <Typography variant="h6" noWrap>
          {user?.protected?.user?.role_name || 'User'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.protected?.user?.role_name  === 'Admin' ? 'Administrator' : 'User'}
        </Typography>
      </Box>
      <Divider />
      <List>
        <SidebarItem 
          to="/" 
          icon={<DashboardIcon />} 
          text="Dashboard" 
          sidebarOpen={sidebarOpen}
        />
        {user?.protected?.user?.role_name  === 'Admin' && (
          <SidebarItem 
            to="/ums" 
            icon={<PeopleIcon />} 
            text="User Management" 
            sidebarOpen={sidebarOpen}
          />
        )}
        <SidebarItem 
          to="/tms" 
          icon={<TicketIcon />} 
          text="Ticket Management" 
          sidebarOpen={sidebarOpen}
        />
        <SidebarItem 
          to="/reports" 
          icon={<ReportsIcon />} 
          text="Reports" 
          sidebarOpen={sidebarOpen}
        />
      </List>
      <Divider />
      <List>
        <SidebarItem 
          to="/profile" 
          icon={<ProfileIcon />} 
          text="Profile" 
          sidebarOpen={sidebarOpen}
        />
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      {/* Desktop drawer */}
      <Drawer
        variant="persistent"
        open={sidebarOpen}
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;