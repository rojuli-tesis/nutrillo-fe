'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  useTheme,
  Skeleton,
} from '@mui/material';
import {
  LocalFireDepartment as FireIcon,
} from '@mui/icons-material';
import { pointsService, PointsStatus } from '@/services/pointsService';
import { calculateStreakMultiplier } from '@/utils/streakHelpers';

interface StreakDisplayProps {
  streakType: 'mealLogging' | 'plateBuilder';
  title: string;
}

const StreakDisplay: React.FC<StreakDisplayProps> = ({ streakType, title }) => {
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
        // Don't show error to user, just don't display streak
      } finally {
        setLoading(false);
      }
    };

    fetchPointsStatus();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" width={60} height={20} />
      </Box>
    );
  }

  if (!pointsStatus) {
    return null;
  }

  const streak = pointsStatus.streaks[streakType];
  const multiplier = calculateStreakMultiplier(streak.currentStreak);

  // Only show streak when it's more than 1 day
  if (streak.currentStreak <= 1) {
    return null;
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1.5,
      p: 2,
      borderRadius: 2,
      bgcolor: streak.currentStreak > 0 
        ? theme.palette.success.light 
        : theme.palette.background.paper,
      border: `2px solid ${streak.currentStreak > 0 
        ? theme.palette.success.main 
        : theme.palette.divider}`,
      minWidth: 200,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: 1,
      }
    }}>
      <FireIcon 
        sx={{ 
          color: streak.currentStreak > 0 
            ? theme.palette.error.dark 
            : theme.palette.text.disabled,
          fontSize: 24 
        }} 
      />
      <Box sx={{ flexGrow: 1 }}>
        <Typography 
          variant="body2" 
          color={streak.currentStreak > 0 ? 'text.primary' : 'text.secondary'} 
          sx={{ 
            fontSize: '0.75rem',
            fontWeight: 'medium'
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: 'bold',
            color: streak.currentStreak > 0 ? 'text.primary' : 'text.secondary'
          }}
        >
          {streak.currentStreak} día{streak.currentStreak !== 1 ? 's' : ''}
        </Typography>
      </Box>
      {multiplier > 1 && (
        <Chip
          label={`${multiplier.toFixed(1)}x`}
          size="small"
          color="success"
          sx={{ 
            fontSize: '0.75rem',
            height: 24,
            fontWeight: 'bold',
            '& .MuiChip-label': { px: 1.5 }
          }}
        />
      )}
    </Box>
  );
};

export default StreakDisplay;
