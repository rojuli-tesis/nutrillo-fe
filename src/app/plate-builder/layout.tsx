import React from 'react';
import { Box } from '@mui/material';

export default function PlateBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      {children}
    </Box>
  );
} 