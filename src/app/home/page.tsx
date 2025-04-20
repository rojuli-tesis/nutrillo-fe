"use client";

import React from 'react';
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
    colorKey: 'primary'
  },
  {
    title: 'Planes de nutrición',
    description: 'Ver planes',
    icon: <AssignmentIcon />,
    path: '/plans',
    colorKey: 'secondary'
  },
  {
    title: 'Construye tu plato',
    description: 'Crea platos balanceados',
    icon: <LocalDiningIcon />,
    path: '/plate-builder',
    colorKey: 'success'
  }
] as const;

const HomePageContent = () => {
  const router = useRouter();
  const theme = useTheme();
  const { getPatientName } = useUser();
  const patientName = getPatientName();

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 4 } }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: 4,
            fontWeight: 'bold',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '1.75rem', sm: '2.125rem' }
          }}
        >
          {getTimeBasedGreeting(patientName)}
        </Typography>

        <Grid 
          container 
          spacing={{ xs: 2, sm: 3 }}
          sx={{ 
            maxWidth: 'min(100%, 600px)',
            mx: 'auto'
          }}
        >
          {QUICK_ACCESS_ITEMS.map((item, index) => (
            <Grid item xs={6} key={index}>
              <QuickAccessCard
                title={item.title}
                description={item.description}
                icon={item.icon}
                color={theme.palette[item.colorKey].main}
                onClick={() => router.push(item.path)}
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
            Recent Activity
          </Typography>
          <Card sx={{ borderRadius: { xs: 2, sm: 3 } }}>
            <Box sx={{ p: 3 }}>
              <Typography color="text.secondary">
                No recent activity to show
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