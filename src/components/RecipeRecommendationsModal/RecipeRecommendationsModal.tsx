'use client'
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider,
  IconButton,
  Tooltip,
  Grid,
  Paper,
} from '@mui/material';
import {
  AccessTime,
  Restaurant,
  TrendingUp,
  Star,
  Favorite,
  FavoriteBorder,
  Close,
} from '@mui/icons-material';
import { Recipe, GenerateRecipeRequest, RecipeRecommendationResponse } from '@/services/recipeService';
import { recipeService } from '@/services/recipeService';
import { useUser } from '@/contexts/UserContext';

interface RecipeRecommendationsModalProps {
  open: boolean;
  onClose: () => void;
  plateEvaluationId: number;
  ingredients: string[];
  evaluationScore: number;
  evaluationIssues: string[];
  onPointsUpdate?: (remainingPoints: number) => void;
}

const RecipeRecommendationsModal: React.FC<RecipeRecommendationsModalProps> = ({
  open,
  onClose,
  plateEvaluationId,
  ingredients,
  evaluationScore,
  evaluationIssues,
  onPointsUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [recipeResponse, setRecipeResponse] = useState<RecipeRecommendationResponse | null>(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Set<string>>(new Set());
  const { state: userState } = useUser();

  const handleGenerateRecipes = async () => {
    setLoading(true);
    setError('');
    setRecipeResponse(null);

    try {
      const request: GenerateRecipeRequest = {
        plateEvaluationId,
        ingredients,
        evaluationScore,
        evaluationIssues,
      };

      const response = await recipeService.generateRecipeRecommendations(request);
      setRecipeResponse(response);
      
      // Update points in parent component
      if (onPointsUpdate) {
        onPointsUpdate(response.remainingPoints);
      }
    } catch (error: any) {
      console.error('Error generating recipe recommendations:', error);
      if (error.response?.status === 402) {
        setError('No tienes suficientes puntos para generar recomendaciones de recetas. Necesitas 5 puntos.');
      } else {
        setError('Error al generar recomendaciones de recetas. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (recipeName: string) => {
    setFavoriteRecipes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recipeName)) {
        newSet.delete(recipeName);
      } else {
        newSet.add(recipeName);
      }
      return newSet;
    });
  };

  const getDifficultyColor = (difficulty: string) => {
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

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Medio';
      case 'hard':
        return 'Difícil';
      default:
        return difficulty;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Restaurant color="primary" />
          <Typography variant="h5" component="span">
            Recomendaciones de Recetas
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          aria-label="Cerrar"
          sx={{ color: 'text.secondary' }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {!recipeResponse && !loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              ¿Quieres recibir recomendaciones de recetas?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Basándonos en tu plato evaluado, podemos sugerirte recetas saludables que mejoren los aspectos nutricionales identificados.
            </Typography>
            
            <Paper
              elevation={2}
              sx={{
                p: 3,
                mb: 3,
                backgroundColor: 'primary.50',
                border: '1px solid',
                borderColor: 'primary.200',
              }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                Costo: 5 puntos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tu saldo actual: {userState.user?.points || 0} puntos
              </Typography>
            </Paper>

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleGenerateRecipes}
              disabled={loading || (userState.user?.points || 0) < 5}
              startIcon={loading ? <CircularProgress size={20} /> : <TrendingUp />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              {loading ? 'Generando...' : 'Generar Recomendaciones'}
            </Button>
          </Box>
        )}

        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Generando recomendaciones...
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
              Nuestro chef está creando recetas personalizadas para ti
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {recipeResponse && (
          <Box>
            <Box sx={{ mb: 3, p: 2, backgroundColor: 'success.50', borderRadius: 2 }}>
              <Typography variant="h6" color="success.main" gutterBottom>
                ✅ Recomendaciones Generadas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Se generaron {recipeResponse.recipes.length} recetas. Costo: {recipeResponse.pointsSpent} puntos. 
                Saldo restante: {recipeResponse.remainingPoints} puntos.
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {recipeResponse.recipes.map((recipe, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card
                    elevation={2}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        elevation: 4,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {recipe.name}
                        </Typography>
                        <Tooltip title={favoriteRecipes.has(recipe.name) ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
                          <IconButton
                            onClick={() => handleToggleFavorite(recipe.name)}
                            color="primary"
                            size="small"
                            aria-label={favoriteRecipes.has(recipe.name) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                          >
                            {favoriteRecipes.has(recipe.name) ? <Favorite /> : <FavoriteBorder />}
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {recipe.description}
                      </Typography>

                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip
                          icon={<AccessTime />}
                          label={recipe.cookingTime}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={getDifficultyLabel(recipe.difficulty)}
                          color={getDifficultyColor(recipe.difficulty) as any}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>

                      <Typography variant="subtitle2" gutterBottom>
                        Ingredientes:
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        {recipe.ingredients.map((ingredient, idx) => (
                          <Chip
                            key={idx}
                            label={ingredient}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>

                      <Typography variant="subtitle2" gutterBottom>
                        Beneficios nutricionales:
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        {recipe.nutritionalBenefits.map((benefit, idx) => (
                          <Chip
                            key={idx}
                            label={benefit}
                            size="small"
                            color="success"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>

                      <Typography variant="subtitle2" gutterBottom>
                        Instrucciones:
                      </Typography>
                      <Box component="ol" sx={{ pl: 2, m: 0 }}>
                        {recipe.instructions.map((instruction, idx) => (
                          <Typography
                            key={idx}
                            component="li"
                            variant="body2"
                            sx={{ mb: 0.5 }}
                          >
                            {instruction}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>

                    <CardActions sx={{ pt: 0 }}>
                      <Button
                        size="small"
                        color="primary"
                        startIcon={<Star />}
                        onClick={() => handleToggleFavorite(recipe.name)}
                      >
                        {favoriteRecipes.has(recipe.name) ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
        {recipeResponse && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateRecipes}
            disabled={loading || (userState.user?.points || 0) < 5}
            startIcon={<TrendingUp />}
          >
            Generar Nuevas Recomendaciones
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RecipeRecommendationsModal;
