"use client";

import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Card,
  Box,
  useTheme,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import HistoryIcon from '@mui/icons-material/History';
import { useRouter } from 'next/navigation';
import MainLayout from '../components/MainLayout';
import { getTimeBasedGreeting } from './helpers';
import { useUser, UserProvider } from '@/contexts/UserContext';
import { QuickAccessCard } from '../components/QuickAccessCard';
import WeeklyActivity from '@/components/WeeklyActivity';
import PointsHistory from '@/components/PointsHistory';
import { pointsService, PointsStatus, PointTransaction } from '@/services/pointsService';

const QUICK_ACCESS_ITEMS = [
  {
    title: 'Registrar comida',
    description: 'Registra tus comidas diarias',
    icon: <RestaurantIcon />,
    path: '/meal-log',
    color: 'primary'
  },
  {
    title: 'Planes de nutrición',
    description: 'Ver planes',
    icon: <AssignmentIcon />,
    path: '/plans',
    color: 'secondary'
  },
  {
    title: 'Construye tu plato',
    description: 'Crea platos balanceados',
    icon: <LocalDiningIcon />,
    path: '/plate-builder',
    color: 'success'
  },
  {
    title: 'Historial de comidas',
    description: 'Ver tu historial de comidas',
    icon: <HistoryIcon />,
    path: '/meal-log-list',
    color: 'info'
  }
] as const;

const HomePageContent = () => {
  const router = useRouter();
  const theme = useTheme();
  const { getPatientName } = useUser();
  const patientName = getPatientName();
  const [greeting, setGreeting] = useState('');
  const [pointsHistory, setPointsHistory] = useState<PointTransaction[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    setGreeting(getTimeBasedGreeting(patientName));
  }, [patientName]);

  useEffect(() => {
    const fetchPointsHistory = async () => {
      try {
        setDataLoading(true);
        setHistoryLoading(true);
        
        const history = await pointsService.getPointsHistory(5); // Get last 5 transactions
        setPointsHistory(history.transactions);
      } catch (error) {
        console.error('Error fetching points history:', error);
        // Don't show error to user, just don't display history
      } finally {
        setDataLoading(false);
        setHistoryLoading(false);
      }
    };

    fetchPointsHistory();
  }, []);

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4, px: 6 }}>
        <Typography variant="h4" gutterBottom>
          {greeting}
        </Typography>
        
        {/* Weekly Activity */}
        <WeeklyActivity 
          loading={dataLoading} 
        />
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {QUICK_ACCESS_ITEMS.map((item) => (
            <Grid item xs={6} sm={6} md={4} key={item.path}>
              <QuickAccessCard
                title={item.title}
                description={item.description}
                icon={item.icon}
                onClick={() => router.push(item.path)}
                color={theme.palette[item.color].main}
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ 
          maxWidth: 'min(100%, 600px)',
          mx: 'auto',
          mt: 6 
        }}>
          <PointsHistory 
            transactions={pointsHistory} 
            loading={historyLoading} 
          />
        </Box>
      </Container>
    </MainLayout>
  );
};

const HomePage = () => {
  return (
    <UserProvider>
      <HomePageContent />
    </UserProvider>
  );
};

export default HomePage; 