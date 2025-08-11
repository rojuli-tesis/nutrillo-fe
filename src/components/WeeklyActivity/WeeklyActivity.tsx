'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  useTheme,
  Skeleton,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
} from '@mui/icons-material';
import { pointsService, PointsStatus } from '@/services/pointsService';
import { 
  getWeekDays, 
  isDayActive, 
  getEncouragementMessage, 
  getActiveDaysCount,
  WeekDay 
} from '@/utils/streakHelpers';

interface WeeklyActivityProps {
  loading?: boolean;
}

const WeeklyActivity: React.FC<WeeklyActivityProps> = ({ loading = false }) => {
  const theme = useTheme();
  const [pointsStatus, setPointsStatus] = useState<PointsStatus | null>(null);
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    const fetchPointsStatus = async () => {
      try {
        setLoadingState(true);
        const status = await pointsService.getPointsStatus();
        setPointsStatus(status);
      } catch (error) {
        console.error('Error fetching points status:', error);
        // Don't show error to user, just don't display activity
      } finally {
        setLoadingState(false);
      }
    };

    fetchPointsStatus();
  }, []);



  if (loading || loadingState) {
    return (
      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={28} sx={{ mb: 2 }} />
          <Grid container spacing={1}>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Grid item xs key={i}>
                <Skeleton variant="circular" width={40} height={40} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }

  if (!pointsStatus) {
    return null;
  }

  const weekDays = getWeekDays();
  const activeDays = getActiveDaysCount(weekDays, pointsStatus);

  return (
    <Card sx={{ borderRadius: 3, mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Actividad Semanal
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeDays}/7 días
          </Typography>
        </Box>

        <Grid container spacing={1}>
          {weekDays.map((day, index) => {
            const isActive = isDayActive(day.date, pointsStatus);
            const isToday = day.isToday;
            
            return (
              <Grid item xs key={index}>
                                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: isToday 
                        ? theme.palette.primary.main 
                        : isActive 
                          ? theme.palette.success.light
                          : theme.palette.background.paper,
                      border: isToday 
                        ? `2px solid ${theme.palette.primary.dark}` 
                        : isActive 
                          ? `1px solid ${theme.palette.success.main}`
                          : `1px solid ${theme.palette.divider}`,
                      minHeight: 60,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: 1,
                      }
                    }}
                  >
                    <Typography 
                      variant="caption" 
                      color={isToday ? 'white' : isActive ? 'text.primary' : 'text.secondary'}
                      sx={{ 
                        fontSize: '0.75rem',
                        fontWeight: isToday || isActive ? 'bold' : 'normal',
                        mb: 0.5
                      }}
                    >
                      {day.name}
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      {isActive ? (
                        <CheckCircleIcon 
                          sx={{ 
                            color: isToday ? 'white' : theme.palette.success.dark,
                            fontSize: 28,
                            filter: isToday ? 'brightness(0) invert(1)' : 'none'
                          }} 
                        />
                      ) : (
                        <UncheckedIcon 
                          sx={{ 
                            color: day.isPast 
                              ? theme.palette.text.disabled 
                              : isToday 
                                ? 'white' 
                                : theme.palette.text.secondary,
                            fontSize: 28
                          }} 
                        />
                      )}
                    </Box>
                  </Box>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {getEncouragementMessage(activeDays)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeeklyActivity;
