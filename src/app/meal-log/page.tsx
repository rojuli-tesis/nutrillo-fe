"use client";

import React from 'react';
import { Button, Container, Stack, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import MainLayout from '../components/MainLayout';
import { MealLogForm } from './components/MealLogForm';
import { getSuggestedMealType } from '@/types/meals';
import restClient from '@/utils/restClient';
import ArrowBack from '@mui/icons-material/ArrowBack';
import StreakDisplay from '@/components/StreakDisplay';
const MealLogPage = () => {
  const router = useRouter();
  const currentHour = new Date().getHours();
  const suggestedMealType = getSuggestedMealType(currentHour);

  const handleSubmit = async (formData: FormData) => {
    try {
      await restClient.post('/food-log/meals', formData);
      // Return to the meal log list page
      router.push('/meal-log-list');
      router.refresh();
    } catch (error) {
      console.error('Error saving meal log:', error);
      throw error;
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="sm" sx={{ py: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <Button variant="text" color="inherit" href="/meal-log-list" sx={{ minWidth: 0, p: 0 }}>
            <ArrowBack />
          </Button>
          <Typography variant="h5" component="h1">
            Registrar comida
          </Typography>
        </Stack>

        {/* Streak Display */}
        <Box sx={{ mb: 3 }}>
          <StreakDisplay 
            streakType="mealLogging" 
            title="Racha de registro de comidas" 
          />
        </Box>

        <MealLogForm
          initialTime={currentHour}
          initialMealType={suggestedMealType}
          onSubmit={handleSubmit}
        />
      </Container>
    </MainLayout>
  );
};

export default MealLogPage; 