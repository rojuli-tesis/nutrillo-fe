'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Container,
  Button,
} from '@mui/material';
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from '@dnd-kit/core';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import MainLayout from '@/app/components/MainLayout';
import { PlateIngredient } from '@/types/plate-ingredient';
import { getPlateIngredients } from './helper';
import { getUniqueTypes, getFilteredSubtypes, filterIngredients } from '@/components/PlateBuilder/helper';
import restClient from '@/utils/restClient';
import { useUser } from '@/contexts/UserContext';
import { usePlateStore } from './usePlateStore';
import { PlateHeader } from './components/PlateHeader';
import { PlateSearchBar } from './components/PlateSearchBar';
import { PlateCanvas } from './components/PlateCanvas';
import { IngredientList } from './components/IngredientList';
import { PlateEvaluationModal } from './components/PlateEvaluationModal';
import { Recipe } from './components/GeneratedRecipesView';

interface PlateEvaluation {
  score: number;
  positives: string[];
  issues: string[];
  suggestions: string;
  nutritionistNotes?: string;
  evaluationId?: number;
}

export default function PlateBuilderPage() {
  const router = useRouter();
  const { state: userState, dispatch: userDispatch } = useUser();
  const { enqueueSnackbar } = useSnackbar();
  
  // Store state
  const {
    selectedIngredients,
    searchValue,
    filtersOpen,
    addIngredient,
    removeIngredient,
    clearPlate,
    setSearchValue,
    toggleFilters,
  } = usePlateStore();

  // Local state
  const [plateIngredients, setPlateIngredients] = useState<PlateIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [evaluationModalOpen, setEvaluationModalOpen] = useState(false);
  const [evaluationLoading, setEvaluationLoading] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<PlateEvaluation | null>(null);
  const [evaluationError, setEvaluationError] = useState<string>('');
  const [savingToFavorites, setSavingToFavorites] = useState(false);
  const [generatingRecipes, setGeneratingRecipes] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipePointsSpent, setRecipePointsSpent] = useState<number>(0);
  const [recipeRemainingPoints, setRecipeRemainingPoints] = useState<number>(0);
  const [savedRecipes, setSavedRecipes] = useState<Set<string>>(new Set());

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Load ingredients
  useEffect(() => {
    getPlateIngredients()
      .then((data) => {
        setPlateIngredients(data);
      })
      .catch((error) => {
        console.error('Error loading ingredients:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Get filter options
  const types = useMemo(() => getUniqueTypes(plateIngredients), [plateIngredients]);
  const subtypes = useMemo(
    () => getFilteredSubtypes(plateIngredients, searchValue.type || 'all'),
    [plateIngredients, searchValue.type]
  );

  // Filter ingredients based on search and filters
  const filteredIngredients = useMemo(() => {
    let filtered = filterIngredients(
      plateIngredients,
      searchValue.type || 'all',
      searchValue.subtype || 'all'
    );

    // Apply search query
    if (searchValue.q.trim()) {
      const query = searchValue.q.trim().toLowerCase();
      filtered = filtered.filter((ingredient) =>
        ingredient.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [plateIngredients, searchValue]);

  // DnD handlers
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);

    if (event.over && event.over.id === 'plate') {
      const ingredientName = event.active.id as string;
      const ingredient = plateIngredients.find((i) => i.name === ingredientName);

      if (ingredient) {
        handleAddIngredient(ingredient);
      }
    }
  };

  // Ingredient handlers
  const handleAddIngredient = (ingredient: PlateIngredient) => {
    // Check if ingredient is already on plate
    const alreadyAdded = selectedIngredients.some(
      (i) => i.name === ingredient.name
    );

    if (!alreadyAdded) {
      addIngredient(ingredient);
    }
  };

  const handleRemoveIngredient = (index: number) => {
    removeIngredient(index);
  };

  // Evaluation handlers
  const handleEvaluatePlate = async () => {
    if (selectedIngredients.length < 3) {
      return;
    }

    setEvaluationLoading(true);
    setEvaluationError('');
    setEvaluationModalOpen(true);

    try {
      const response = await restClient.post('/plate-evaluator/evaluate', {
        ingredients: selectedIngredients.map((ing) => ({
          name: ing.name,
          type: ing.type.label,
          subtype: ing.subtype?.label,
        })),
      });

      setEvaluationResult(response);
      handlePointsUpdate(response.score);
    } catch (error: any) {
      console.error('Error evaluating plate:', error);
      setEvaluationError(
        error?.message || 'Error al evaluar el plato. Por favor intenta nuevamente.'
      );
    } finally {
      setEvaluationLoading(false);
    }
  };

  const handlePointsUpdate = (points: number) => {
    if (userState.user) {
      const currentPoints = userState.user.points || 0;
      const remainingPoints = Math.max(0, currentPoints - points);

      userDispatch({
        type: 'SET_USER',
        payload: { ...userState.user, points: remainingPoints },
      });
    }
  };

  const handleSaveToFavorites = async () => {
    if (!evaluationResult || !evaluationResult.evaluationId) return;

    setSavingToFavorites(true);
    try {
      await restClient.put(`/plate-evaluator/${evaluationResult.evaluationId}/toggle-favorite`, {});
      setEvaluationModalOpen(false);
      router.push('/favorites');
    } catch (error) {
      console.error('Error saving to favorites:', error);
    } finally {
      setSavingToFavorites(false);
    }
  };

  const handleCloseEvaluation = () => {
    setEvaluationModalOpen(false);
    setEvaluationResult(null);
    setEvaluationError('');
    setRecipes([]);
    setRecipePointsSpent(0);
    setRecipeRemainingPoints(0);
    clearPlate();
  };

  const handleGenerateRecipes = async () => {
    if (!evaluationResult) return;

    setGeneratingRecipes(true);
    try {
      const response = await restClient.post('/recipe-recommendations/generate', {
        ingredients: selectedIngredients.map((ing) => ing.name),
        positives: evaluationResult.positives,
        improvements: evaluationResult.issues,
      });

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
      setEvaluationError(
        error?.message || 'Error al generar recetas. Por favor intenta nuevamente.'
      );
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

  // Get active ingredient for drag overlay
  const activeIngredient = activeId
    ? plateIngredients.find((i) => i.name === activeId)
    : null;

  return (
    <MainLayout>
      <Box
        sx={{
          height: 'calc(100vh - 64px)', // Account for navbar height
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          mt: -2, // Compensate for MainLayout's pt: 2
        }}
      >
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Fixed Top Section: Header, Search, Plate, and Evaluate Button */}
          <Box
            sx={{
              flexShrink: 0,
              bgcolor: 'background.paper',
              borderBottom: 1,
              borderColor: 'divider',
              boxShadow: 1,
            }}
          >
            <Container maxWidth="sm" sx={{ px: 2 }}>
              {/* Header with title and info */}
              <Box sx={{ pt: 2 }}>
                <PlateHeader />
              </Box>

              {/* Search & Filters */}
              <PlateSearchBar
                value={searchValue}
                onChange={setSearchValue}
                filtersOpen={filtersOpen}
                onToggleFilters={toggleFilters}
                types={types}
                subtypes={subtypes}
              />

              {/* Plate Canvas */}
              <PlateCanvas
                items={selectedIngredients}
                onDrop={handleAddIngredient}
                onRemove={handleRemoveIngredient}
                minCount={3}
              />

              {/* Evaluation Button */}
              {selectedIngredients.length >= 3 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, pb: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleEvaluatePlate}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      boxShadow: 2,
                      minHeight: '48px',
                      '&:hover': {
                        boxShadow: 4,
                      },
                    }}
                  >
                    Evaluar Plato
                  </Button>
                </Box>
              )}
            </Container>
          </Box>

          {/* Scrollable Ingredients List */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              bgcolor: 'background.default',
            }}
          >
            <Container maxWidth="sm" sx={{ px: 2, py: 3 }}>
              <IngredientList
                items={filteredIngredients}
                onAdd={handleAddIngredient}
                isLoading={loading}
              />
            </Container>
          </Box>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeIngredient && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: activeIngredient.type.color,
                  color: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  fontSize: '14px',
                  fontWeight: 600,
                  boxShadow: 4,
                  minHeight: 48,
                  minWidth: 120,
                  textTransform: 'capitalize',
                }}
              >
                {activeIngredient.name}
              </Box>
            )}
          </DragOverlay>
        </DndContext>
      </Box>

      {/* Evaluation Modal */}
      <PlateEvaluationModal
        open={evaluationModalOpen}
        score={evaluationResult?.score}
        ingredients={selectedIngredients.map(i => i.name)}
        positives={evaluationResult?.positives}
        improvements={evaluationResult?.issues}
        suggestions={evaluationResult?.suggestions}
        nutritionistNotes={evaluationResult?.nutritionistNotes}
        loading={evaluationLoading}
        error={evaluationError}
        userPoints={userState.user?.points || 0}
        recipeCost={5}
        recipes={recipes}
        recipePointsSpent={recipePointsSpent}
        recipeRemainingPoints={recipeRemainingPoints}
        savedRecipes={savedRecipes}
        onClose={handleCloseEvaluation}
        onSaveToFavorites={handleSaveToFavorites}
        onSaveRecipe={handleSaveRecipe}
        savingToFavorites={savingToFavorites}
        onGenerateRecipes={handleGenerateRecipes}
        generatingRecipes={generatingRecipes}
      />
    </MainLayout>
  );
}