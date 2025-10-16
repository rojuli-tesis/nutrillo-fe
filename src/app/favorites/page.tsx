'use client'
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  AlertTitle,
  IconButton,
  Button,
} from '@mui/material';
import { Favorite, FavoriteBorder, Visibility, Star, Message } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import restClient from '@/utils/restClient';
import GaugeChart from '@/components/GaugeChart';
import MainLayout from '../components/MainLayout';
import { PlateEvaluationModal } from '../plate-builder/components/PlateEvaluationModal';
import { usePlateStore } from '../plate-builder/usePlateStore';
import { PlateIngredient } from '@/types/plate-ingredient';
import { useUser } from '@/contexts/UserContext';
import { Recipe } from '../plate-builder/components/GeneratedRecipesView';

interface SavedEvaluation {
  id: number;
  ingredients: Array<{
    name: string;
    type: string;
    subtype?: string;
  }>;
  evaluation: {
    score: number;
    positives: string[];
    issues: string[];
    suggestions: string;
  };
  userNotes?: string;
  nutritionistNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<SavedEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedEvaluation, setSelectedEvaluation] = useState<SavedEvaluation | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [allIngredients, setAllIngredients] = useState<PlateIngredient[]>([]);
  const [generatingRecipes, setGeneratingRecipes] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipePointsSpent, setRecipePointsSpent] = useState<number>(0);
  const [recipeRemainingPoints, setRecipeRemainingPoints] = useState<number>(0);
  const [savedRecipes, setSavedRecipes] = useState<Set<string>>(new Set());
  const router = useRouter();
  const { setSelectedIngredients } = usePlateStore();
  const { state: userState, dispatch: userDispatch } = useUser();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchFavorites();
    fetchAllIngredients();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await restClient.get<SavedEvaluation[]>('/plate-evaluator/favorites');
      // Ensure scores are numbers
      const processedFavorites = response.map(fav => ({
        ...fav,
        evaluation: {
          ...fav.evaluation,
          score: parseFloat(fav.evaluation.score.toString())
        }
      }));
      setFavorites(processedFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Error al cargar tus platos favoritos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllIngredients = async () => {
    try {
      const response = await restClient.get<PlateIngredient[]>('/plate-ingredient');
      setAllIngredients(response);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  const handleToggleFavorite = async (evaluationId: number) => {
    try {
      await restClient.put(`/plate-evaluator/${evaluationId}/toggle-favorite`);
      // Remove from favorites list
      setFavorites(prev => prev.filter(fav => fav.id !== evaluationId));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleViewDetails = (evaluation: SavedEvaluation) => {
    setSelectedEvaluation(evaluation);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedEvaluation(null);
  };

  const handleCreateSimilar = () => {
    if (!selectedEvaluation) return;

    // Find the full ingredient objects from the saved ingredient names
    const ingredientsToLoad: PlateIngredient[] = [];
    
    selectedEvaluation.ingredients.forEach((savedIng) => {
      const fullIngredient = allIngredients.find(
        (ing) => ing.name.toLowerCase() === savedIng.name.toLowerCase()
      );
      if (fullIngredient) {
        ingredientsToLoad.push(fullIngredient);
      }
    });

    // Set the ingredients in the store
    setSelectedIngredients(ingredientsToLoad);
    
    // Close modal and navigate
    handleCloseDetailModal();
    router.push('/plate-builder');
  };

  const handleGenerateRecipes = async () => {
    if (!selectedEvaluation) return;

    setGeneratingRecipes(true);
    try {
      const payload = {
        plateEvaluationId: selectedEvaluation.id,
        ingredients: selectedEvaluation.ingredients.map(ing => ing.name),
        evaluationScore: parseFloat(selectedEvaluation.evaluation.score.toString()),
        evaluationIssues: selectedEvaluation.evaluation.issues,
      };
      
      const response = await restClient.post('/recipe-recommendations/generate-from-plate', payload);

      console.log('Recipe recommendations:', response);
      
      // Store recipes data
      setRecipes(response.recipes || []);
      setRecipePointsSpent(response.pointsSpent || 0);
      setRecipeRemainingPoints(response.remainingPoints || 0);
      
      // Update user points
      if (userState.user && response.remainingPoints !== undefined) {
        userDispatch({
          type: 'SET_USER',
          payload: { ...userState.user, points: response.remainingPoints },
        });
      }
    } catch (error: any) {
      console.error('Error generating recipes:', error);
      if (error.response?.status === 402) {
        alert('No tienes suficientes puntos para generar recomendaciones de recetas. Necesitas 5 puntos.');
      } else if (error.response?.status === 400) {
        alert('Error en los datos del plato. Por favor, intenta de nuevo.');
      } else {
        alert('Error al generar recomendaciones de recetas. Por favor, intenta de nuevo.');
      }
    } finally {
      setGeneratingRecipes(false);
    }
  };

  const handleSaveRecipe = async (recipe: Recipe) => {
    // Check if recipe is already saved
    if (savedRecipes.has(recipe.name)) {
      enqueueSnackbar('Esta receta ya fue guardada', { variant: 'info' });
      return;
    }

    try {
      await restClient.post('/recipes', {
        name: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        cookingTime: recipe.cookingTime,
        difficulty: recipe.difficulty,
        nutritionalBenefits: recipe.nutritionalBenefits,
      });
      
      // Add to saved recipes set
      setSavedRecipes(prev => new Set(Array.from(prev).concat(recipe.name)));
      
      // Show success snackbar
      enqueueSnackbar(`¡Receta "${recipe.name}" guardada exitosamente! Podés verla en "Mis Recetas".`, { 
        variant: 'success',
        autoHideDuration: 4000 
      });

      // Remove from saved set after 3 seconds to allow saving again if needed
      setTimeout(() => {
        setSavedRecipes(prev => {
          const newSet = new Set(prev);
          newSet.delete(recipe.name);
          return newSet;
        });
      }, 3000);
    } catch (error: any) {
      console.error('Error saving recipe:', error);
      enqueueSnackbar('Error al guardar la receta. Por favor intenta nuevamente.', { 
        variant: 'error' 
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <MainLayout>

    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <Star sx={{ color: 'warning.main' }} />
          Mis Platos Favoritos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Tus combinaciones de ingredientes guardadas para inspirarte en la cocina
        </Typography>
      </Box>

      {favorites.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tienes platos favoritos aún
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Evalúa algunos platos y guárdalos como favoritos para verlos aquí
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => router.push('/plate-builder')}
            startIcon={<span>🍽️</span>}
          >
            Crear un Plato
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((favorite) => (
            <Grid item xs={12} sm={6} md={4} key={favorite.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Score */}
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <GaugeChart value={favorite.evaluation.score} />
                  </Box>

                  {/* Ingredients */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>
                      Ingredientes:
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {favorite.ingredients.map((ingredient, index) => (
                        <Chip
                          key={index}
                          label={ingredient.name}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      ))}
                    </Stack>
                  </Box>

                  {/* Positives */}
                  {favorite.evaluation.positives.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="success.main" gutterBottom sx={{ fontWeight: 600 }}>
                        ✅ Positivos:
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        {favorite.evaluation.positives.slice(0, 2).join(', ')}
                        {favorite.evaluation.positives.length > 2 && '...'}
                      </Typography>
                    </Box>
                  )}

                  {/* Date and Notes Indicator */}
                  <Box sx={{ mt: 'auto', pt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Guardado: {formatDate(favorite.createdAt)}
                    </Typography>
                    {favorite.nutritionistNotes && (
                      <Chip
                        icon={<Message />}
                        label="Comentarios"
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    )}
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => handleViewDetails(favorite)}
                      sx={{ flex: 1 }}
                    >
                      Ver Detalles
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleToggleFavorite(favorite.id)}
                      sx={{ border: '1px solid', borderColor: 'error.main' }}
                    >
                      <Favorite />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Detail Modal - Using Unified Component */}
      <PlateEvaluationModal
        open={detailModalOpen}
        score={selectedEvaluation?.evaluation.score}
        ingredients={selectedEvaluation?.ingredients.map(i => i.name)}
        positives={selectedEvaluation?.evaluation.positives}
        improvements={selectedEvaluation?.evaluation.issues}
        suggestions={selectedEvaluation?.evaluation.suggestions}
        nutritionistNotes={selectedEvaluation?.nutritionistNotes}
        savedAt={selectedEvaluation ? new Date(selectedEvaluation.createdAt) : undefined}
        plateEvaluationId={selectedEvaluation?.id}
        userPoints={userState.user?.points || 0}
        recipeCost={5}
        recipes={recipes}
        recipePointsSpent={recipePointsSpent}
        recipeRemainingPoints={recipeRemainingPoints}
        generatingRecipes={generatingRecipes}
        savedRecipes={savedRecipes}
        onClose={handleCloseDetailModal}
        onCreateSimilar={handleCreateSimilar}
        onGenerateRecipes={handleGenerateRecipes}
        onSaveRecipe={handleSaveRecipe}
      />
    </Box>
    </MainLayout>

  );
};

export default FavoritesPage; 