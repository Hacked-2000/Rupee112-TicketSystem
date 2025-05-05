// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
// import { motion } from 'framer-motion';

// const SidebarItem = ({ to, icon, text, sidebarOpen }) => {
//   return (
//     <motion.div whileHover={{ scale: 1.02 }}>
//       <ListItem disablePadding>
//         <ListItemButton component={Link} to={to}>
//           <ListItemIcon>
//             {icon}
//           </ListItemIcon>
//           {sidebarOpen && <ListItemText primary={text} />}
//         </ListItemButton>
//       </ListItem>
//     </motion.div>
//   );
// };

// export default SidebarItem;
import React from 'react';
import { Link } from 'react-router-dom';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';

const SidebarItem = ({ to, icon, text, sidebarOpen }) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <ListItem disablePadding>
        <ListItemButton 
          component={Link} 
          to={to}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(25, 118, 210, 0.16)',
              color: '#ffffff',
            },
            '&.Mui-selected:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.24)',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            {icon}
          </ListItemIcon>
          {sidebarOpen && (
            <ListItemText 
              primary={text} 
              primaryTypographyProps={{ 
                fontWeight: 500,
                fontSize: '0.875rem'
              }} 
            />
          )}
        </ListItemButton>
      </ListItem>
    </motion.div>
  );
};

export default SidebarItem;