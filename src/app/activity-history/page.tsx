'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  useTheme,
  Skeleton,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  LocalFireDepartment as FireIcon,
} from '@mui/icons-material';
import MainLayout from '../components/MainLayout';
import ActivityCalendar from '@/components/ActivityCalendar';
import { pointsService, ActivityHistory } from '@/services/pointsService';

const ActivityHistoryPage = () => {
  const theme = useTheme();
  const [activityHistory, setActivityHistory] = useState<ActivityHistory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityHistory = async () => {
      try {
        setLoading(true);
        const data = await pointsService.getActivityHistory();
        setActivityHistory(data);
      } catch (error) {
        console.error('Error fetching activity history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityHistory();
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color = 'primary' 
  }: { 
    title: string; 
    value: string | number; 
    icon: React.ReactNode; 
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  }) => (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            color: `${color}.main`,
            mr: 1 
          }}>
            {icon}
          </Box>
          <Typography variant="h6" component="h3">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <MainLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Skeleton variant="text" width="40%" height={48} sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
            </Grid>
          </Grid>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Historial de Actividad
        </Typography>
        
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Días Activos"
              value={activityHistory?.totalActiveDays || 0}
              icon={<CalendarIcon />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Racha Más Larga"
              value={activityHistory?.longestStreak || 0}
              icon={<FireIcon />}
              color="error"
            />
          </Grid>
      
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total de Puntos"
              value={activityHistory?.dailyActivities.reduce((sum, activity) => sum + activity.totalPointsEarned, 0) || 0}
              icon={<TrendingUpIcon />}
              color="success"
            />
          </Grid>
        </Grid>

        {/* Calendar */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Calendario de Actividad
          </Typography>
          <ActivityCalendar />
        </Box>

        {/* Recent Activity List */}
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Actividad Reciente
          </Typography>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              {activityHistory?.dailyActivities.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                  No hay actividad registrada aún
                </Typography>
              ) : (
                <Box>
                  {activityHistory?.dailyActivities.slice(0, 10).map((activity) => (
                    <Box
                      key={activity.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        py: 2,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        '&:last-child': {
                          borderBottom: 'none',
                        },
                      }}
                    >
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {new Date(activity.activityDate).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {activity.mealLogCount > 0 && `${activity.mealLogCount} comida(s) registrada(s)`}
                          {activity.mealLogCount > 0 && activity.plateEvaluationCount > 0 && ' • '}
                          {activity.plateEvaluationCount > 0 && `${activity.plateEvaluationCount} plato(s) evaluado(s)`}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                          +{activity.totalPointsEarned} pts
                        </Typography>
                        {activity.averageMultiplier > 1 && (
                          <Typography variant="caption" color="text.secondary">
                            {activity.averageMultiplier.toFixed(1)}x
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default ActivityHistoryPage;

