'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import PlateBuilder from '../../components/PlateBuilder/PlateBuilder';
import { PlateIngredient } from '@/types/plate-ingredient';
import { getPlateIngredients } from './helper';
import MainLayout from '../components/MainLayout';

export default function PlateBuilderPage() {
  const [plateIngredients, setPlateIngredients] = useState<PlateIngredient[]>([]);

  useEffect(() => {
    getPlateIngredients().then((data) => {
      setPlateIngredients(data);
    });
  }, []);

  return (
    <MainLayout>
    <Container maxWidth="lg" sx={{ py: 1 }}>
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Construye tu Plato
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
          Construye tu plato perfecto arrastrando y soltando ingredientes en el plato
        </Typography>
        <PlateBuilder plateIngredients={plateIngredients} />
      </Box>
    </Container>
    </MainLayout>

  );
} 