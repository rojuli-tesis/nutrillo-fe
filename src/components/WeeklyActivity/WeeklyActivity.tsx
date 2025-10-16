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
      <Card sx={{ borderRadius: 3, mb: 2, boxShadow: 'none', border: 'none' }}>
        <CardContent sx={{ py: 1, px: 2, '&:last-child': { pb: 1 } }}>
          <Skeleton variant="text" width="60%" height={20} sx={{ mb: 0.5 }} />
          <Grid container spacing={0.5}>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Grid item xs key={i}>
                <Skeleton variant="circular" width={28} height={28} />
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
    <Card sx={{ borderRadius: 3, mb: 2, boxShadow: 'none', border: 'none' }}>
      <CardContent sx={{ py: 1, px: 2, '&:last-child': { pb: 1 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
          <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
            Actividad Semanal
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            {activeDays}/7 días
          </Typography>
        </Box>

        <Grid container spacing={0.5}>
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
                      p: 0.5,
                      borderRadius: 1.5,
                      bgcolor: isToday 
                        ? theme.palette.primary.main 
                        : isActive 
                          ? theme.palette.success.light
                          : 'transparent',
                      minHeight: 38,
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <Typography 
                      variant="caption" 
                      color={isToday ? 'white' : isActive ? 'text.primary' : 'text.secondary'}
                      sx={{ 
                        fontSize: '0.6rem',
                        fontWeight: isToday || isActive ? 'bold' : 'normal',
                        mb: 0.1,
                        lineHeight: 1.1
                      }}
                    >
                      {day.name}
                    </Typography>
                    <Box>
                      {isActive ? (
                        <CheckCircleIcon 
                          sx={{ 
                            color: isToday ? 'white' : theme.palette.success.dark,
                            fontSize: 18,
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
                            fontSize: 18
                          }} 
                        />
                      )}
                    </Box>
                  </Box>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ mt: 0.75, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            {getEncouragementMessage(activeDays)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeeklyActivity;
