// import React from 'react';
// import { useSelector } from 'react-redux';
// import { styled, useTheme } from '@mui/material/styles';
// import { 
//   Drawer, 
//   List, 
//   Divider, 
//   IconButton, 
//   ListItem, 
//   ListItemButton, 
//   ListItemIcon, 
//   ListItemText, 
//   Avatar, 
//   Typography,
//   Box 
// } from '@mui/material';
// import {
//   ChevronLeft,
//   ChevronRight,
//   Dashboard as DashboardIcon,
//   People as PeopleIcon,
//   Assignment as TicketIcon,
//   Assessment as ReportsIcon,
//   AccountCircle as ProfileIcon,
// } from '@mui/icons-material';
// import { motion } from 'framer-motion';
// import SidebarItem from './sidebarItems';

// const drawerWidth = 240;

// const DrawerHeader = styled('div')(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   padding: theme.spacing(0, 1),
//   ...theme.mixins.toolbar,
//   justifyContent: 'flex-end',
// }));

// const Sidebar = ({ mobileOpen, sidebarOpen, handleDrawerToggle }) => {
//   const theme = useTheme();
//   const { user } = useSelector((state) => state.auth);
//   const themeMode = useSelector((state) => state.theme.mode);
//   console.log(user.protected.user);
  

//   const mappedRole = (role_id) => {
//     switch (role_id) {
//       case 3: return 'ADMIN';
//       case 2: return 'USER';
//       default: return 'guest';
//     }
//   };
//   const userRole = mappedRole(user?.role_id);

//   const drawer = (
//     <div>
//       <DrawerHeader>
//         <IconButton onClick={handleDrawerToggle}>
//           {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
//         </IconButton>
//       </DrawerHeader>
//       <Divider />
//       <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <Avatar 
//             sx={{ 
//               width: 64, 
//               height: 64,
//               mb: 1,
//               bgcolor: theme.palette.secondary.main,
//             }}
//           >
//             {user?.protected.user?.role_name?.charAt(0) || 'U'}
//           </Avatar>
//         </motion.div>
//         <Typography variant="h6" noWrap>
//           {user?.protected?.user?.role_name || 'User'}
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           {user?.protected?.user?.role_name  === 'Admin' ? 'Administrator' : 'User'}
//         </Typography>
//       </Box>
//       <Divider />
//       <List>
//         <SidebarItem 
//           to="/" 
//           icon={<DashboardIcon />} 
//           text="Dashboard" 
//           sidebarOpen={sidebarOpen}
//         />
//         {user?.protected?.user?.role_name  === 'Admin' && (
//           <SidebarItem 
//             to="/ums" 
//             icon={<PeopleIcon />} 
//             text="User Management" 
//             sidebarOpen={sidebarOpen}
//           />
//         )}
//         <SidebarItem 
//           to="/tms" 
//           icon={<TicketIcon />} 
//           text="Ticket Management" 
//           sidebarOpen={sidebarOpen}
//         />
//         <SidebarItem 
//           to="/reports" 
//           icon={<ReportsIcon />} 
//           text="Reports" 
//           sidebarOpen={sidebarOpen}
//         />
//       </List>
//       <Divider />
//       <List>
//         <SidebarItem 
//           to="/profile" 
//           icon={<ProfileIcon />} 
//           text="Profile" 
//           sidebarOpen={sidebarOpen}
//         />
//       </List>
//     </div>
//   );

//   return (
//     <Box
//       component="nav"
//       sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
//       aria-label="mailbox folders"
//     >
//       {/* Mobile drawer */}
//       <Drawer
//         variant="temporary"
//         open={mobileOpen}
//         onClose={handleDrawerToggle}
//         ModalProps={{
//           keepMounted: true, // Better open performance on mobile.
//         }}
//         sx={{
//           display: { xs: 'block', sm: 'none' },
//           '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
//         }}
//       >
//         {drawer}
//       </Drawer>
//       {/* Desktop drawer */}
//       <Drawer
//         variant="persistent"
//         open={sidebarOpen}
//         sx={{
//           display: { xs: 'none', sm: 'block' },
//           '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
//         }}
//       >
//         {drawer}
//       </Drawer>
//     </Box>
//   );
// };

// export default Sidebar;
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
  Box,
  Tooltip
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assessment as ReportsIcon,
  AccountCircle as ProfileIcon,
  Settings as SettingsIcon
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
  
  // Get role permissions from master role API data
  const rolePermissions = user?.master?.data || [];
  const currentRole = user?.protected?.user?.role_id;
  
  // Define available menu items with required roles
  const menuItems = [
    {
      id: 'dashboard',
      to: '/',
      icon: <DashboardIcon />,
      text: 'Dashboard',
      roles: [1, 2, 3, 4, 5] // All roles have access to dashboard
    },
    {
      id: 'ums',
      to: '/ums',
      icon: <PeopleIcon />,
      text: 'User Management',
      roles: [3] // Only Admin
    },
    {
      id: 'reports',
      to: '/reports',
      icon: <ReportsIcon />,
      text: 'Reports',
      roles: [2, 3] // Manager and Admin
    },
    {
      id: 'settings',
      to: '/settings',
      icon: <SettingsIcon />,
      text: 'Settings',
      roles: [3] // Only Admin
    },
    {
      id: 'profile',
      to: '/profile',
      icon: <ProfileIcon />,
      text: 'Profile',
      roles: [1, 2, 3, 4, 5] // All roles have access to profile
    }
  ];

  // Filter menu items based on user's role
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(currentRole)
  );

  // Group main items and profile/settings separately
  const mainItems = filteredMenuItems.filter(item => 
    ['dashboard', 'ums', 'reports'].includes(item.id)
  );
  
  const secondaryItems = filteredMenuItems.filter(item => 
    ['profile', 'settings'].includes(item.id)
  );

  const getUserRoleName = () => {
    const role = rolePermissions.find(r => r.role_id === currentRole);
    return role?.role_name || 'User';
  };

  const getUserRoleDescription = () => {
    switch(currentRole) {
      case 3: return 'Administrator';
      case 2: return 'Manager';
      case 1: return 'Support';
      case 4: return 'Agent';
      case 5: return 'Client';
      default: return 'User';
    }
  };

  const drawer = (
    <Box sx={{ 
      height: '100%',
      background: 'linear-gradient(180deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      color: '#ffffff'
    }}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerToggle} sx={{ color: '#ffffff' }}>
          {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </DrawerHeader>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Tooltip title={getUserRoleDescription()} placement="right">
            <Avatar 
              sx={{ 
                width: 64, 
                height: 64,
                mb: 1,
                bgcolor: theme.palette.primary.main,
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}
            >
              {getUserRoleName().charAt(0)}
            </Avatar>
          </Tooltip>
        </motion.div>
        <Typography variant="h6" noWrap sx={{ color: '#ffffff', fontWeight: 600 }}>
          {user?.protected?.user?.name || 'User'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          {getUserRoleName()}
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      <List>
        {mainItems.map((item) => (
          <SidebarItem 
            key={item.id}
            to={item.to} 
            icon={item.icon} 
            text={item.text} 
            sidebarOpen={sidebarOpen}
          />
        ))}
      </List>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      <List sx={{ mt: 'auto' }}>
        {secondaryItems.map((item) => (
          <SidebarItem 
            key={item.id}
            to={item.to} 
            icon={item.icon} 
            text={item.text} 
            sidebarOpen={sidebarOpen}
          />
        ))}
      </List>
    </Box>
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
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
          },
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
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;