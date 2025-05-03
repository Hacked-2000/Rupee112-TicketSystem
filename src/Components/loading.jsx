import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          rotate: { 
            repeat: Infinity, 
            duration: 2, 
            ease: "linear" 
          },
          scale: {
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1,
          }
        }}
      >
        <CircularProgress size={60} thickness={4} color="secondary" />
      </motion.div>
      <Typography variant="h6" sx={{ mt: 3 }}>
        Loading...
      </Typography>
    </Box>
  );
};

export default Loading;