'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  BookmarkAdd as BookmarkAddIcon,
  Bookmark as BookmarkIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';

export type Recipe = {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  nutritionalBenefits: string[];
};

export interface GeneratedRecipesViewProps {
  recipes: Recipe[];
  pointsSpent: number;
  remainingPoints: number;
  savedRecipes?: Set<string>;
  onSaveRecipe?: (recipe: Recipe) => void;
}

// Helper to get difficulty display properties
const getDifficultyProps = (difficulty: 'easy' | 'medium' | 'hard') => {
  switch (difficulty) {
    case 'easy':
      return { label: 'Fácil', color: 'success' as const };
    case 'medium':
      return { label: 'Media', color: 'warning' as const };
    case 'hard':
      return { label: 'Difícil', color: 'error' as const };
    default:
      return { label: 'Media', color: 'default' as const };
  }
};

export const GeneratedRecipesView: React.FC<GeneratedRecipesViewProps> = ({
  recipes,
  pointsSpent,
  remainingPoints,
  savedRecipes = new Set(),
  onSaveRecipe,
}) => {
  const handleSaveRecipe = (recipe: Recipe) => {
    if (onSaveRecipe) {
      onSaveRecipe(recipe);
    } else {
      // Placeholder for now
      console.log('Saving recipe:', recipe.name);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header with points info */}
      <Box
        sx={{
          mb: 3,
          p: 2,
          bgcolor: '#e8f5e9',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'success.main',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.dark', mb: 0.5 }}>
          ✨ Recetas Generadas
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Se gastaron <strong>{pointsSpent} puntos</strong> • Saldo restante: <strong>{remainingPoints} puntos</strong>
        </Typography>
      </Box>

      {/* Recipes List */}
      <Stack spacing={3}>
        {recipes.map((recipe, index) => (
          <Card
            key={index}
            elevation={1}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              '&:hover': {
                boxShadow: 3,
              },
              transition: 'box-shadow 0.2s',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Recipe Header */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <RestaurantIcon sx={{ color: 'primary.main' }} />
                  {recipe.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.6,
                  }}
                >
                  {recipe.description}
                </Typography>
              </Box>

              {/* Tags Section */}
              <Box sx={{ mb: 2.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {/* Cooking Time */}
                <Chip
                  icon={<AccessTimeIcon />}
                  label={recipe.cookingTime}
                  size="small"
                  sx={{
                    bgcolor: '#e3f2fd',
                    color: '#1565c0',
                    fontWeight: 500,
                  }}
                />

                {/* Difficulty */}
                <Chip
                  label={getDifficultyProps(recipe.difficulty).label}
                  size="small"
                  color={getDifficultyProps(recipe.difficulty).color}
                  sx={{ fontWeight: 500 }}
                />
              </Box>

              {/* Nutritional Benefits */}
              {recipe.nutritionalBenefits && recipe.nutritionalBenefits.length > 0 && (
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: 'success.dark',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      mb: 1,
                      display: 'block',
                    }}
                  >
                    💚 Beneficios Nutricionales
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {recipe.nutritionalBenefits.map((benefit, idx) => (
                      <Chip
                        key={idx}
                        label={benefit}
                        size="small"
                        sx={{
                          bgcolor: '#f1f8e9',
                          color: '#558b2f',
                          fontSize: '0.75rem',
                          height: 24,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Divider sx={{ my: 2.5 }} />

              {/* Ingredients Section */}
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 1.5,
                    color: 'text.primary',
                    fontSize: '0.9rem',
                  }}
                >
                  🥘 Ingredientes
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {recipe.ingredients.map((ingredient, idx) => (
                    <Chip
                      key={idx}
                      label={ingredient}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: 'primary.light',
                        color: 'text.primary',
                        fontSize: '0.813rem',
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 2.5 }} />

              {/* Instructions Section */}
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 1.5,
                    color: 'text.primary',
                    fontSize: '0.9rem',
                  }}
                >
                  📝 Instrucciones
                </Typography>
                <List
                  component="ol"
                  sx={{
                    listStyleType: 'decimal',
                    pl: 2.5,
                    m: 0,
                    '& .MuiListItem-root': {
                      display: 'list-item',
                      p: 0,
                      mb: 1,
                    },
                  }}
                >
                  {recipe.instructions.map((instruction, idx) => (
                    <ListItem key={idx}>
                      <ListItemText
                        primary={instruction}
                        primaryTypographyProps={{
                          variant: 'body2',
                          sx: {
                            color: 'text.secondary',
                            lineHeight: 1.6,
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              {/* Save Button */}
              <Button
                variant={savedRecipes.has(recipe.name) ? "contained" : "outlined"}
                color={savedRecipes.has(recipe.name) ? "success" : "primary"}
                startIcon={savedRecipes.has(recipe.name) ? <BookmarkIcon /> : <BookmarkAddIcon />}
                fullWidth
                onClick={() => handleSaveRecipe(recipe)}
                disabled={savedRecipes.has(recipe.name)}
                sx={{
                  mt: 1,
                  py: 1.2,
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                }}
              >
                {savedRecipes.has(recipe.name) ? 'Guardado ✓' : 'Guardar en Mis Recetas'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* No recipes message */}
      {recipes.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            px: 3,
          }}
        >
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
            No se generaron recetas
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Por favor intenta nuevamente
          </Typography>
        </Box>
      )}
    </Box>
  );
};
