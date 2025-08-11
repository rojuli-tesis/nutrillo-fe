'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  useTheme,
  Skeleton,
} from '@mui/material';
import {
  Star as StarIcon,
  LocalFireDepartment as FireIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { PointsStatus } from '@/services/pointsService';

interface PointsDisplayProps {
  pointsStatus: PointsStatus | null;
  loading?: boolean;
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({ pointsStatus, loading = false }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
          <Box sx={{ mt: 2 }}>
            <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 2 }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!pointsStatus) {
    return null;
  }

  const { totalPoints, streaks } = pointsStatus;

  return (
    <Card sx={{ borderRadius: 3, mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <StarIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
          <Typography variant="h6" component="h2">
            Tus Puntos
          </Typography>
        </Box>

        {/* Total Points */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h3" component="div" sx={{ 
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            textAlign: 'center'
          }}>
            {totalPoints.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            puntos totales
          </Typography>
        </Box>

        {/* Streaks */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ 
              textAlign: 'center',
              p: 2,
              borderRadius: 2,
              bgcolor: theme.palette.background.default
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <FireIcon sx={{ color: theme.palette.error.main, mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  Registro de Comidas
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {streaks.mealLogging.currentStreak}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                días consecutivos
              </Typography>
              <Chip
                label={`${streaks.mealLogging.multiplier.toFixed(1)}x`}
                size="small"
                color="primary"
                sx={{ mt: 1 }}
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ 
              textAlign: 'center',
              p: 2,
              borderRadius: 2,
              bgcolor: theme.palette.background.default
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ color: theme.palette.success.main, mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  Constructor de Platos
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {streaks.plateBuilder.currentStreak}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                días consecutivos
              </Typography>
              <Chip
                label={`${streaks.plateBuilder.multiplier.toFixed(1)}x`}
                size="small"
                color="success"
                sx={{ mt: 1 }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Streak Info */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Mantén tu racha para ganar más puntos
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PointsDisplay;
