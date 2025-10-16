'use client';

import React from 'react';
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Skeleton,
  useTheme,
} from '@mui/material';
import { PlateIngredient } from '@/types/plate-ingredient';
import DraggableIngredient from '@/components/PlateBuilder/DraggableIngredient';

export interface IngredientListProps {
  items: PlateIngredient[];
  onAdd: (ingredient: PlateIngredient) => void;
  isLoading?: boolean;
}

export const IngredientList: React.FC<IngredientListProps> = ({
  items,
  onAdd,
  isLoading = false,
}) => {
  const theme = useTheme();

  if (isLoading) {
    return (
      <Grid container spacing={1.5}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Skeleton
              variant="rectangular"
              height={64}
              sx={{ borderRadius: 1 }}
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (items.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 6,
          color: 'text.secondary',
        }}
      >
        <Typography variant="body1">
          No se encontraron ingredientes
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Intenta ajustar los filtros de búsqueda
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={1.5}>
      {items.map((ingredient) => (
        <Grid item xs={6} md={3} key={ingredient.id}>
          <DraggableIngredient
            id={ingredient.name}
            onKeyboardAdd={() => onAdd(ingredient)}
          >
            <Card
              sx={{
                height: '100%',
                minHeight: 64,
                display: 'flex',
                flexDirection: 'row',
                overflow: 'hidden',
                cursor: 'grab',
                transition: 'all 0.2s',
                bgcolor: ingredient.type.color,
                color: 'white',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
                '&:active': {
                  cursor: 'grabbing',
                },
              }}
            >
              <CardContent
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  '&:last-child': { pb: 1.5 },
                  minWidth: 0, // Allow text truncation
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: { xs: '0.813rem', md: '0.875rem' },
                  }}
                >
                  {ingredient.name}
                </Typography>
              </CardContent>
              
              {!ingredient.imageUrl?.includes('default-ingredient') && (
                <Box
                  component="img"
                  src={ingredient.imageUrl}
                  alt={ingredient.name}
                  sx={{
                    width: 56,
                    height: '100%',
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />
              )}
            </Card>
          </DraggableIngredient>
        </Grid>
      ))}
    </Grid>
  );
};
