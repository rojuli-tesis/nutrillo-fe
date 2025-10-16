'use client';

import React from 'react';
import {
  Chip,
  Typography,
  Skeleton,
} from '@mui/material';
import { useUser } from '@/contexts/UserContext';
import CoinIcon from '../icons/CoinIcon';

const PointsBadge: React.FC = () => {
  const { state } = useUser();
  const { user, isLoading } = state;

  if (isLoading) {
    return (
      <Skeleton 
        variant="rectangular" 
        width={80} 
        height={32} 
        sx={{ borderRadius: 16 }}
      />
    );
  }

  if (!user || typeof user.points !== 'number') {
    return null;
  }

  return (
    <Chip
      icon={<CoinIcon sx={{ fontSize: 20 }} />}
      label={
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          {user.points.toLocaleString()}
        </Typography>
      }
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.15)',
        color: 'white',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        fontWeight: 'bold',
        '&:hover': {
          bgcolor: 'rgba(255, 255, 255, 0.25)',
          border: '2px solid rgba(255, 255, 255, 0.4)',
        },
        '& .MuiChip-label': {
          px: 1.5,
        },
      }}
    />
  );
};

export default PointsBadge;
