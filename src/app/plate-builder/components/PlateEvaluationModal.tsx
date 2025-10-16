'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
  Stack,
  Chip,
  Button,
  Box,
  Divider,
  CircularProgress,
  Alert,
  AlertTitle,
} from '@mui/material';
import GaugeChart from '@/components/GaugeChart';
import { GeneratedRecipesView, Recipe } from './GeneratedRecipesView';

export interface PlateEvaluationModalProps {
  open: boolean;
  score?: number;
  ingredients?: string[];
  positives?: string[];
  improvements?: string[];
  suggestions?: string;
  nutritionistNotes?: string; // Notes from nutritionist for patient education
  savedAt?: Date;
  loading?: boolean;
  error?: string;
  userPoints?: number; // User's current points balance
  recipeCost?: number; // Cost in points for recipes
  recipes?: Recipe[]; // Generated recipes
  recipePointsSpent?: number; // Points spent on recipes
  recipeRemainingPoints?: number; // Points remaining after recipe generation
  plateEvaluationId?: number; // ID of the plate evaluation for recipe generation
  savedRecipes?: Set<string>; // Set of saved recipe names
  onClose: () => void;
  onCreateSimilar?: () => void;
  onGenerateRecipes?: () => void;
  onSaveToFavorites?: () => void;
  onSaveRecipe?: (recipe: Recipe) => void;
  savingToFavorites?: boolean;
  generatingRecipes?: boolean;
}

// Helper function to get score status
const getScoreStatus = (score: number): { label: string; color: 'success' | 'warning' | 'error' } => {
  if (score >= 8) return { label: 'Excelente', color: 'success' };
  if (score >= 6) return { label: 'Bien', color: 'warning' };
  return { label: 'A mejorar', color: 'error' };
};

type ModalView = 'analysis' | 'recipeConfirmation' | 'recipes';

export const PlateEvaluationModal: React.FC<PlateEvaluationModalProps> = ({
  open,
  score,
  ingredients = [],
  positives = [],
  improvements = [],
  suggestions,
  nutritionistNotes,
  savedAt,
  loading = false,
  error,
  userPoints = 0,
  recipeCost = 5,
  recipes,
  recipePointsSpent,
  recipeRemainingPoints,
  plateEvaluationId,
  savedRecipes = new Set(),
  onClose,
  onCreateSimilar,
  onGenerateRecipes,
  onSaveToFavorites,
  onSaveRecipe,
  savingToFavorites = false,
  generatingRecipes = false,
}) => {
  const hasData = score !== undefined;
  const [currentView, setCurrentView] = useState<ModalView>('analysis');

  // Switch to recipes view when recipes are available
  useEffect(() => {
    if (recipes && recipes.length > 0) {
      setCurrentView('recipes');
    }
  }, [recipes]);

  // Reset view when modal closes
  const handleClose = () => {
    setCurrentView('analysis');
    onClose();
  };

  const handleShowRecipeConfirmation = () => {
    setCurrentView('recipeConfirmation');
  };

  const handleConfirmGenerateRecipes = () => {
    if (onGenerateRecipes) {
      onGenerateRecipes();
    }
  };

  const handleCancelRecipes = () => {
    setCurrentView('analysis');
  };

  const handleBackToAnalysis = () => {
    setCurrentView('analysis');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          m: { xs: 1, sm: 2 },
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1.5, pt: 2.5 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
          {currentView === 'recipes' 
            ? 'Recetas Generadas'
            : currentView === 'recipeConfirmation' 
            ? 'Recomendaciones de Recetas'
            : savedAt ? 'Detalles del Plato' : 'Evaluación de tu Plato'}
        </Typography>
      </DialogTitle>
      <Divider />
      
      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 2.5 }}>
        {currentView === 'recipes' ? (
          /* Generated Recipes View */
          recipes && recipePointsSpent !== undefined && recipeRemainingPoints !== undefined ? (
            <GeneratedRecipesView
              recipes={recipes}
              pointsSpent={recipePointsSpent}
              remainingPoints={recipeRemainingPoints}
              savedRecipes={savedRecipes}
              onSaveRecipe={onSaveRecipe}
            />
          ) : null
        ) : currentView === 'recipeConfirmation' ? (
          /* Recipe Confirmation View */
          <Stack spacing={3} sx={{ py: 2 }}>
            {/* Icon */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: '#e0f2f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                }}
              >
                🍽️
              </Box>
            </Box>

            {/* Intro Text */}
            <Box sx={{ textAlign: 'center', px: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                ¿Quieres recibir recomendaciones de recetas?
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                {savedAt 
                  ? 'Basándonos en este plato guardado, podemos sugerirte recetas saludables que mejoren los aspectos nutricionales identificados.'
                  : 'Basándonos en tu plato evaluado, podemos sugerirte recetas saludables que mejoren los aspectos nutricionales identificados.'
                }
              </Typography>
            </Box>

            {/* Cost Box */}
            <Box
              sx={{
                bgcolor: '#e0f2f1',
                p: 2.5,
                borderRadius: 2,
                textAlign: 'center',
                border: '1px solid',
                borderColor: '#b2dfdb',
              }}
            >
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 0.5,
                  fontSize: '1.1rem',
                }}
              >
                Costo: {recipeCost} puntos
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Tu saldo actual: <strong>{userPoints} puntos</strong>
              </Typography>
            </Box>
          </Stack>
        ) : loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: '12px' }}>
            <AlertTitle sx={{ fontWeight: 600 }}>Error</AlertTitle>
            {error}
          </Alert>
        ) : hasData ? (
          <Stack spacing={2}>
            {/* Score Section */}
            <Paper
              elevation={2}
              sx={{
                py: 2.5,
                px: 3,
                borderRadius: '12px',
                textAlign: 'center',
                bgcolor: '#f0f4f8',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
                <GaugeChart value={score || 0} />
              </Box>
              <Chip
                label={getScoreStatus(score || 0).label}
                color={getScoreStatus(score || 0).color}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  height: 28,
                  borderRadius: '14px',
                }}
              />
            </Paper>

            {/* Ingredients Section */}
            {ingredients.length > 0 && (
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: 'background.paper',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 1.5,
                    color: 'text.primary',
                    fontSize: '0.875rem',
                  }}
                >
                  🧆 Ingredientes utilizados
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {ingredients.map((ingredient, idx) => (
                    <Chip
                      key={idx}
                      label={ingredient}
                      size="small"
                      sx={{
                        bgcolor: 'primary.light',
                        color: 'primary.dark',
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            )}

            {/* Nutritionist Notes */}
            {nutritionistNotes && (
              <Paper
                elevation={2}
                sx={{
                  p: 2.5,
                  borderRadius: '12px',
                  bgcolor: '#e3f2fd',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  position: 'relative',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 1.5,
                    color: 'primary.dark',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  💬 Comentarios de tu Nutricionista
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: 1.6,
                    color: 'text.primary',
                    fontSize: '0.875rem',
                    fontStyle: 'italic',
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                    p: 1.5,
                    borderRadius: '8px',
                    border: '1px solid rgba(25, 118, 210, 0.2)',
                  }}
                >
                  &ldquo;{nutritionistNotes}&rdquo;
                </Typography>
              </Paper>
            )}

            {/* Positive Aspects */}
            {positives.length > 0 && (
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: '#e8f5e9',
                  border: '1px solid',
                  borderColor: 'success.main',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: 'success.dark',
                    fontSize: '0.875rem',
                  }}
                >
                  ✓ Aspectos Positivos
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                  {positives.map((positive, idx) => (
                    <Typography
                      component="li"
                      variant="body2"
                      key={idx}
                      sx={{
                        mb: 0.5,
                        lineHeight: 1.6,
                        color: 'text.primary',
                        fontSize: '0.875rem',
                      }}
                    >
                      {positive}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            )}

            {/* Areas to Improve */}
            {improvements.length > 0 && (
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: '#fff3e0',
                  border: '1px solid',
                  borderColor: 'warning.main',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: 'warning.dark',
                    fontSize: '0.875rem',
                  }}
                >
                  ⚠ Áreas de Mejora
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                  {improvements.map((improvement, idx) => (
                    <Typography
                      component="li"
                      variant="body2"
                      key={idx}
                      sx={{
                        mb: 0.5,
                        lineHeight: 1.6,
                        color: 'text.primary',
                        fontSize: '0.875rem',
                      }}
                    >
                      {improvement}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            )}

            {/* Suggestions */}
            {suggestions && (
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: '#ede7f6',
                  border: '1px solid',
                  borderColor: '#9575cd',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: '#5e35b1',
                    fontSize: '0.875rem',
                  }}
                >
                  💡 Sugerencias
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: 1.6,
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                  }}
                >
                  {suggestions}
                </Typography>
              </Paper>
            )}

            {/* Metadata */}
            {savedAt && (
              <Box sx={{ pt: 1, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Guardado el {new Date(savedAt).toLocaleDateString('es-AR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>
            )}
          </Stack>
        ) : null}
      </DialogContent>

      <Divider sx={{ mt: 1 }} />
      
      <DialogActions
        sx={{
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        {currentView === 'recipes' ? (
          /* Recipes View Buttons */
          <Stack direction="row" spacing={1.5} sx={{ width: '100%' }}>
            <Button
              onClick={handleBackToAnalysis}
              variant="outlined"
              sx={{ flex: 1 }}
            >
              Ver Evaluación
            </Button>
            <Button
              onClick={handleClose}
              variant="contained"
              color="primary"
              sx={{ flex: 1 }}
            >
              Cerrar
            </Button>
          </Stack>
        ) : currentView === 'recipeConfirmation' ? (
          /* Recipe Confirmation Buttons */
          <>
            <Button
              onClick={handleConfirmGenerateRecipes}
              disabled={generatingRecipes || userPoints < recipeCost}
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {generatingRecipes ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                  Generando...
                </>
              ) : (
                '🎯 Generar Recomendaciones'
              )}
            </Button>
            {userPoints < recipeCost && (
              <Typography variant="caption" color="error" sx={{ textAlign: 'center' }}>
                No tienes suficientes puntos
              </Typography>
            )}
            <Button
              onClick={handleCancelRecipes}
              disabled={generatingRecipes}
              variant="text"
              fullWidth
              sx={{
                color: 'text.secondary',
              }}
            >
              Cerrar
            </Button>
          </>
        ) : (
          /* Analysis View Buttons */
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            sx={{ width: '100%', justifyContent: 'space-between' }}
          >
            <Button
              onClick={handleClose}
              variant="outlined"
              color="inherit"
              sx={{
                minWidth: { xs: '100%', sm: 100 },
                order: { xs: 3, sm: 1 },
              }}
            >
              Cerrar
            </Button>
            
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                order: { xs: 1, sm: 2 },
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {onSaveToFavorites && !savedAt && (
                <Button
                  onClick={onSaveToFavorites}
                  disabled={savingToFavorites || !hasData}
                  variant="outlined"
                  sx={{
                    minWidth: 120,
                    flex: { xs: 1, sm: 'none' },
                  }}
                >
                  {savingToFavorites ? 'Guardando...' : 'Guardar'}
                </Button>
              )}
              
              {onCreateSimilar && savedAt && (
                <Button
                  onClick={onCreateSimilar}
                  variant="contained"
                  color="primary"
                  sx={{
                    minWidth: 120,
                    flex: { xs: 1, sm: 'none' },
                  }}
                >
                  Crear Similar
                </Button>
              )}
              
              {onGenerateRecipes && savedAt && plateEvaluationId && (
                <Button
                  onClick={handleShowRecipeConfirmation}
                  disabled={!hasData || userPoints < recipeCost}
                  variant="contained"
                  color="secondary"
                  sx={{
                    minWidth: 120,
                    flex: { xs: 1, sm: 'none' },
                  }}
                >
                  🍽️ Solicitar Recetas
                </Button>
              )}
              
              {onGenerateRecipes && !savedAt && (
                <Button
                  onClick={handleShowRecipeConfirmation}
                  disabled={!hasData}
                  variant="contained"
                  color="primary"
                  sx={{
                    minWidth: 120,
                    flex: { xs: 1, sm: 'none' },
                  }}
                >
                  Ver Recetas
                </Button>
              )}
            </Stack>
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
};
