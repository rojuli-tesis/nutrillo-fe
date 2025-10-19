'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  useTheme,
  Skeleton,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  LocalDining as PlateIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { PointTransaction } from '@/services/pointsService';
import { translateActivityDescription } from '@/utils/activityTranslations';

interface PointsHistoryProps {
  transactions: PointTransaction[];
  loading?: boolean;
}

const PointsHistory: React.FC<PointsHistoryProps> = ({ transactions, loading = false }) => {
  const theme = useTheme();

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'meal_log':
        return <RestaurantIcon color="primary" />;
      case 'plate_evaluation':
        return <PlateIcon color="success" />;
      default:
        return <TrendingUpIcon color="info" />;
    }
  };

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case 'meal_log':
        return 'primary';
      case 'plate_evaluation':
        return 'success';
      default:
        return 'info';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Skeleton variant="text" width="40%" height={28} sx={{ mb: 2 }} />
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1 }} />
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Actividad reciente
          </Typography>
          <Typography color="text.secondary">
            No hay actividad reciente para mostrar
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Actividad reciente
        </Typography>
        <List sx={{ p: 0 }}>
          {transactions.slice(0, 5).map((transaction) => (
            <ListItem
              key={transaction.id}
              sx={{
                px: 0,
                py: 1,
                borderBottom: `1px solid ${theme.palette.divider}`,
                '&:last-child': {
                  borderBottom: 'none',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {getActivityIcon(transaction.activityType)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {translateActivityDescription(transaction.description)}
                    </Typography>
                    <Chip
                      label={transaction.pointsEarned > 0 ? `+${transaction.pointsEarned}` : `${transaction.pointsEarned}`}
                      size="small"
                      color={getActivityColor(transaction.activityType) as any}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(transaction.createdAt.toString())}
                    </Typography>
                    {transaction.streakMultiplier > 1 && (
                      <Chip
                        label={`${transaction.streakMultiplier.toFixed(1)}x`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default PointsHistory;
