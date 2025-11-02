'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import MainLayout from '../components/MainLayout';
import restClient from '@/utils/restClient';
import { Recipe } from '../plate-builder/components/GeneratedRecipesView';

interface SavedRecipe extends Recipe {
  id: string;
  userId: number;
  createdAt: string;
}

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedRecipe, setSelectedRecipe] = useState<SavedRecipe | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<SavedRecipe | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await restClient.get<SavedRecipe[]>('/recipes');
      setRecipes(data);
    } catch (err: any) {
      console.error('Error fetching recipes:', err);
      setError('Error al cargar las recetas. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (recipe: SavedRecipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseDetails = () => {
    setSelectedRecipe(null);
  };

  const handleDeleteClick = (recipe: SavedRecipe) => {
    setRecipeToDelete(recipe);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!recipeToDelete) return;

    setDeleting(true);
    try {
      await restClient.delete(`/recipes/${recipeToDelete.id}`);
      setRecipes(recipes.filter(r => r.id !== recipeToDelete.id));
      setDeleteDialogOpen(false);
      setRecipeToDelete(null);
    } catch (err: any) {
      console.error('Error deleting recipe:', err);
      alert('Error al eliminar la receta. Por favor intenta nuevamente.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setRecipeToDelete(null);
  };

  const getDifficultyLabel = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Media';
      case 'hard':
        return 'Difícil';
      default:
        return 'Media';
    }
  };

  const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Mis Recetas Guardadas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Todas tus recetas favoritas en un solo lugar
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <Stack spacing={2}>
            {[1, 2, 3].map((i) => (
              <Card key={i} elevation={1}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="40%" />
                  <Box sx={{ mt: 2 }}>
                    <Skeleton variant="rectangular" width="100%" height={60} />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        {/* Empty State */}
        {!loading && recipes.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 3,
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, fontSize: '3rem' }}>
              🧾
            </Typography>
            <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
              Todavía no guardaste ninguna receta
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              ¡Generá una desde la evaluación de tu plato!
            </Typography>
            <Button variant="contained" href="/plate-builder">
              Ir al Constructor de Platos
            </Button>
          </Box>
        )}

        {/* Recipe List */}
        {!loading && recipes.length > 0 && (
          <Stack spacing={3}>
            {recipes.map((recipe) => (
              <Card
                key={recipe.id}
                elevation={1}
                sx={{
                  borderRadius: 3,
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
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {recipe.description}
                    </Typography>
                  </Box>

                  {/* Tags */}
                  <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
                    <Chip
                      label={getDifficultyLabel(recipe.difficulty)}
                      size="small"
                      color={getDifficultyColor(recipe.difficulty) as any}
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>

                  {/* Preview Ingredients */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        display: 'block',
                        mb: 0.5,
                      }}
                    >
                      Ingredientes
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                      {recipe.ingredients.slice(0, 3).map((ingredient, idx) => (
                        <Chip
                          key={idx}
                          label={ingredient}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <Chip
                          label={`+${recipe.ingredients.length - 3} más`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem', fontStyle: 'italic' }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* Actions */}
                  <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewDetails(recipe)}
                      sx={{ flex: 1 }}
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteClick(recipe)}
                    >
                      Eliminar
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <RecipeDetailModal
            recipe={selectedRecipe}
            open={Boolean(selectedRecipe)}
            onClose={handleCloseDetails}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>¿Eliminar receta?</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              ¿Querés eliminar &quot;{recipeToDelete?.name}&quot; de tus favoritos? Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleDeleteCancel} disabled={deleting}>
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              disabled={deleting}
            >
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainLayout>
  );
}

// Recipe Detail Modal Component
interface RecipeDetailModalProps {
  recipe: SavedRecipe;
  open: boolean;
  onClose: () => void;
}

function RecipeDetailModal({ recipe, open, onClose }: RecipeDetailModalProps) {
  const getDifficultyLabel = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Media';
      case 'hard':
        return 'Difícil';
      default:
        return 'Media';
    }
  };

  const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ pb: 2, pt: 3 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
          {recipe.name}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 2 }}>
        <Stack spacing={3}>
          {/* Description */}
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {recipe.description}
          </Typography>

          {/* Tags */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
            <Chip
              label={getDifficultyLabel(recipe.difficulty)}
              size="small"
              color={getDifficultyColor(recipe.difficulty) as any}
              sx={{ fontWeight: 500 }}
            />
          </Box>

          {/* Nutritional Benefits */}
          {recipe.nutritionalBenefits && recipe.nutritionalBenefits.length > 0 && (
            <Box>
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

          {/* Ingredients */}
          <Box>
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

          {/* Instructions */}
          <Box>
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
            <Box
              component="ol"
              sx={{
                m: 0,
                pl: 2.5,
                '& li': {
                  mb: 1,
                  color: 'text.secondary',
                  lineHeight: 1.6,
                  fontSize: '0.875rem',
                },
              }}
            >
              {recipe.instructions.map((instruction, idx) => (
                <li key={idx}>{instruction}</li>
              ))}
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="contained" fullWidth>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}


