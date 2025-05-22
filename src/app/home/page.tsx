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

  useEffect(() => {
    setGreeting(getTimeBasedGreeting(patientName));
  }, [patientName]);

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4, px: 6 }}>
        <Typography variant="h4" gutterBottom>
          {greeting}
        </Typography>
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
          <Typography variant="h6" sx={{ mb: 2 }}>
            Actividad reciente
          </Typography>
          <Card sx={{ borderRadius: { xs: 2, sm: 3 } }}>
            <Box sx={{ p: 3 }}>
              <Typography color="text.secondary">
                No hay actividad reciente para mostrar
              </Typography>
            </Box>
          </Card>
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