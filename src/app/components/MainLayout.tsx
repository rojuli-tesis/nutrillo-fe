import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Navbar />
      <Box component="main" sx={{ pt: 2 }}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 