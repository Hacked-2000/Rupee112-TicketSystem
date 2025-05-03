import React from 'react';
import { Link } from 'react-router-dom';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';

const SidebarItem = ({ to, icon, text, sidebarOpen }) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <ListItem disablePadding>
        <ListItemButton component={Link} to={to}>
          <ListItemIcon>
            {icon}
          </ListItemIcon>
          {sidebarOpen && <ListItemText primary={text} />}
        </ListItemButton>
      </ListItem>
    </motion.div>
  );
};

export default SidebarItem;