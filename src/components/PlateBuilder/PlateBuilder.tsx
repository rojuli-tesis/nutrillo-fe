'use client'
import React, { useState } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  useSensor, 
  useSensors, 
  PointerSensor, 
  DragOverlay
} from '@dnd-kit/core';
import { 
  Box, 
  Paper, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  AlertTitle,
  Chip,
  Stack,
  TextField
} from '@mui/material';
import { useRouter } from 'next/navigation';
import DraggableIngredient from './DraggableIngredient';
import PlateVisualization from './PlateVisualization';
import { PlateIngredient } from '@/types/plate-ingredient';
import { getUniqueTypes, getFilteredSubtypes, filterIngredients } from './helper';
import restClient from '@/utils/restClient';
import GaugeChart from '../GaugeChart';
import RecipeRecommendationsModal from '../RecipeRecommendationsModal';
import { useUser } from '@/contexts/UserContext';

interface PlateEvaluation {
  score: number;
  positives: string[];
  issues: string[];
  suggestions: string;
  evaluationId?: number;
}

const PlateBuilder: React.FC<{
  plateIngredients: PlateIngredient[];
}> = ({
  plateIngredients
}) => {
  const [selectedIngredients, setSelectedIngredients] = useState<PlateIngredient[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('all');
  const [evaluationModalOpen, setEvaluationModalOpen] = useState(false);
  const [evaluationLoading, setEvaluationLoading] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<PlateEvaluation | null>(null);
  const [evaluationError, setEvaluationError] = useState<string>('');
  const [fuzzyFilter, setFuzzyFilter] = useState('');
  const [savingToFavorites, setSavingToFavorites] = useState(false);
  const [recipeModalOpen, setRecipeModalOpen] = useState(false);
  
  const router = useRouter();
  const { state: userState, dispatch: userDispatch } = useUser();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Get types and subtypes using helper functions
  const types = getUniqueTypes(plateIngredients);
  const subtypes = getFilteredSubtypes(plateIngredients, selectedType);
  let filteredIngredients = filterIngredients(plateIngredients, selectedType, selectedSubtype);
  // Apply fuzzy filter
  if (fuzzyFilter.trim()) {
    const filter = fuzzyFilter.trim().toLowerCase();
    filteredIngredients = filteredIngredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(filter)
    );
  }

  // Reset subtype when type changes
  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    setSelectedSubtype('all');
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && over.id === 'plate') {
      const ingredient = plateIngredients.find(ing => ing.name === active.id);
      if (ingredient) {
        setSelectedIngredients(prev => [...prev, ingredient]);
      }
    }
    
    setActiveId(null);
  };

  const handleRemoveIngredient = (index: number) => {
    setSelectedIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handleEvaluatePlate = async () => {
    setEvaluationModalOpen(true);
    setEvaluationLoading(true);
    setEvaluationError('');
    setEvaluationResult(null);

    try {
      // Real API call to plate evaluator endpoint
      const response = await restClient.post('/plate-evaluator/evaluate', {
        ingredients: selectedIngredients.map(ing => ({
          name: ing.name,
          type: ing.type.name,
          subtype: ing.subtype?.name
        }))
      });
      
      setEvaluationResult(response);
    } catch (error) {
      console.error('Error evaluating plate:', error);
      setEvaluationError('Error al evaluar el plato. Por favor, intenta de nuevo.');
    } finally {
      setEvaluationLoading(false);
    }
  };

  const handleTryAgain = () => {
    setEvaluationModalOpen(false);
    setEvaluationResult(null);
    setEvaluationError('');
  };

  const handleFinish = () => {
    setEvaluationModalOpen(false);
    router.push('/home');
  };

  const handleGetRecipeRecommendations = () => {
    setEvaluationModalOpen(false);
    setRecipeModalOpen(true);
  };

  const handleRecipeModalClose = () => {
    setRecipeModalOpen(false);
  };

  const handlePointsUpdate = (remainingPoints: number) => {
    if (userState.user) {
      userDispatch({
        type: 'SET_USER',
        payload: { ...userState.user, points: remainingPoints }
      });
    }
  };

  const handleSaveToFavorites = async () => {
    if (!evaluationResult || !evaluationResult.evaluationId) return;
    
    setSavingToFavorites(true);
    try {
      // Toggle the favorite status for this evaluation
      await restClient.put(`/plate-evaluator/${evaluationResult.evaluationId}/toggle-favorite`, {});
      
      // Show success message and navigate to favorites
      setEvaluationModalOpen(false);
      router.push('/favorites');
    } catch (error) {
      console.error('Error saving to favorites:', error);
      // You could show an error message here
    } finally {
      setSavingToFavorites(false);
    }
  };

  return (
    <Box >
      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <PlateVisualization 
          onDrop={(ingredient) => setSelectedIngredients(prev => [...prev, ingredient])}
          plateIngredients={selectedIngredients}
          onRemoveIngredient={handleRemoveIngredient}
        />

        {/* Evaluation Button */}
        {selectedIngredients.length >= 3 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
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
                '&:hover': {
                  boxShadow: 4,
                }
              }}
            >
              Evaluar Plato
            </Button>
          </Box>
        )}

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={selectedType}
              label="Tipo"
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              {types.map(type => (
                <MenuItem key={type} value={type}>
                  {type === 'all' ? 'Todos' : type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Subtipo</InputLabel>
            <Select
              value={selectedSubtype}
              label="Subtipo"
              onChange={(e) => setSelectedSubtype(e.target.value)}
              disabled={selectedType === 'all'}
            >
              {subtypes.map(subtype => (
                <MenuItem key={subtype} value={subtype}>
                  {subtype === 'all' ? 'Todos' : subtype}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Fuzzy filter input */}
          <TextField
            label="Buscar ingrediente"
            variant="outlined"
            size="small"
            value={fuzzyFilter}
            onChange={e => setFuzzyFilter(e.target.value)}
            sx={{ minWidth: 180 }}
          />
        </Box>

        {/* Ingredients List */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom align="center">
            Ingredientes 
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {filteredIngredients.map((ingredient) => (
              <DraggableIngredient 
                key={ingredient.name} 
                id={ingredient.name}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: ingredient.type.color,
                    fontSize: '14px',
                    padding: 0,
                    borderRadius: '4px',
                    color: 'white',
                    height: 48,
                    minWidth: 120,
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ flex: 1, px: 2, py: 1, textAlign: 'left', whiteSpace: 'nowrap', textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ingredient.name}
                  </Box>
                  {!ingredient.imageUrl?.includes('default-ingredient') && (
                    <Box
                      component="img"
                      src={ingredient.imageUrl}
                      alt={ingredient.name}
                      sx={{
                        height: '100%',
                        width: 40,
                        objectFit: 'cover',
                        borderRadius: '0 4px 4px 0',
                        display: 'block',
                      }}
                    />
                  )}
                </Box>
              </DraggableIngredient>
            ))}
          </Box>
        </Box>

        <DragOverlay>
          {activeId ? (
            <Paper
              sx={{
                padding: '10px 20px',
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
              }}
            >
              {activeId}
            </Paper>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Evaluation Modal */}
      <Dialog
        open={evaluationModalOpen}
        onClose={() => !evaluationLoading && setEvaluationModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '80vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1, 
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="h5" component="span">
            Evaluación del Plato
          </Typography>
          {evaluationLoading && <CircularProgress size={24} />}
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          {evaluationLoading && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              py: 4,
              gap: 2
            }}>
              <CircularProgress size={60} />
              <Typography variant="h6" color="text.secondary">
                Analizando tu plato...
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Nuestro sistema está evaluando la combinación de ingredientes
              </Typography>
            </Box>
          )}
          
          {evaluationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <AlertTitle>Error</AlertTitle>
              {evaluationError}
            </Alert>
          )}
          
          {evaluationResult && (
            <Box sx={{ 
              backgroundColor: 'grey.50', 
              p: 3, 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}>
              {/* Score */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <GaugeChart value={evaluationResult.score} />
              </Box>

              {/* Positives */}
              {evaluationResult.positives.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" color="success.main" gutterBottom>
                    ✅ Aspectos Positivos
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {evaluationResult.positives.map((positive, index) => (
                      <Chip 
                        key={index} 
                        label={positive} 
                        color="success" 
                        variant="outlined" 
                        size="small"
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Issues */}
              {evaluationResult.issues.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" color="warning.main" gutterBottom>
                    ⚠️ Aspectos a Mejorar
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {evaluationResult.issues.map((issue, index) => (
                      <Chip 
                        key={index} 
                        label={issue} 
                        color="warning" 
                        variant="outlined" 
                        size="small"
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Suggestions */}
              {evaluationResult.suggestions && (
                <Box>
                  <Typography variant="h6" color="info.main" gutterBottom>
                    💡 Sugerencias
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {evaluationResult.suggestions}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ 
          px: 3, 
          py: 2, 
          borderTop: '1px solid',
          borderColor: 'divider',
          gap: 1,
          flexWrap: 'wrap',
          justifyContent: 'space-between'
        }}>
          <Button 
            onClick={handleTryAgain}
            disabled={evaluationLoading || savingToFavorites}
            variant="outlined"
            sx={{ minWidth: 120 }}
          >
            Intentar de Nuevo
          </Button>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button 
              onClick={handleGetRecipeRecommendations}
              disabled={evaluationLoading || savingToFavorites || (userState.user?.points || 0) < 5}
              variant="contained"
              color="info"
              startIcon={<span>🍳</span>}
              sx={{ minWidth: 180 }}
            >
              Recetas (5 pts)
            </Button>
            
            <Button 
              onClick={handleFinish}
              disabled={evaluationLoading || savingToFavorites}
              variant="contained"
              color="primary"
              sx={{ minWidth: 100 }}
            >
              Finalizar
            </Button>
            
            <Button 
              onClick={handleSaveToFavorites}
              disabled={evaluationLoading || savingToFavorites}
              variant="contained"
              color="secondary"
              startIcon={savingToFavorites ? <CircularProgress size={16} /> : <span>⭐</span>}
              sx={{ minWidth: 140 }}
            >
              {savingToFavorites ? 'Guardando...' : 'Guardar en Favoritos'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Recipe Recommendations Modal */}
      <RecipeRecommendationsModal
        open={recipeModalOpen}
        onClose={handleRecipeModalClose}
        plateEvaluationId={evaluationResult?.evaluationId || 0}
        ingredients={selectedIngredients.map(ing => ing.name)}
        evaluationScore={evaluationResult?.score || 0}
        evaluationIssues={evaluationResult?.issues || []}
        onPointsUpdate={handlePointsUpdate}
      />
    </Box>
  );
};

export default PlateBuilder; 