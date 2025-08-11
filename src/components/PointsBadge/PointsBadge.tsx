'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  Typography,
  useTheme,
  Skeleton,
} from '@mui/material';
import {
  Star as StarIcon,
} from '@mui/icons-material';
import { pointsService, PointsStatus } from '@/services/pointsService';

const PointsBadge: React.FC = () => {
  const theme = useTheme();
  const [pointsStatus, setPointsStatus] = useState<PointsStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPointsStatus = async () => {
      try {
        setLoading(true);
        const status = await pointsService.getPointsStatus();
        setPointsStatus(status);
      } catch (error) {
        console.error('Error fetching points status:', error);
        // Don't show error to user, just don't display points
      } finally {
        setLoading(false);
      }
    };

    fetchPointsStatus();
  }, []);

  if (loading) {
    return (
      <Skeleton 
        variant="rectangular" 
        width={80} 
        height={32} 
        sx={{ borderRadius: 16 }}
      />
    );
  }

  if (!pointsStatus) {
    return null;
  }

  return (
    <Chip
      icon={<StarIcon sx={{ color: theme.palette.warning.light }} />}
      label={
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          {pointsStatus.totalPoints.toLocaleString()}
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
