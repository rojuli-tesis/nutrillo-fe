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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider
} from '@mui/material';
import { Favorite, FavoriteBorder, Visibility, Star } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import restClient from '@/utils/restClient';
import GaugeChart from '@/components/GaugeChart';
import MainLayout from '../components/MainLayout';

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
  createdAt: string;
  updatedAt: string;
}

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<SavedEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedEvaluation, setSelectedEvaluation] = useState<SavedEvaluation | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await restClient.get<SavedEvaluation[]>('/plate-evaluator/favorites');
      setFavorites(response);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Error al cargar tus platos favoritos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
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

                  {/* Date */}
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 'auto', pt: 1 }}>
                    Guardado: {formatDate(favorite.createdAt)}
                  </Typography>

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

      {/* Detail Modal */}
      <Dialog
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        {selectedEvaluation && (
          <>
            <DialogTitle sx={{ 
              pb: 1, 
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Typography variant="h5" component="span">
                Detalles del Plato
              </Typography>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
              <Box sx={{ 
                backgroundColor: 'grey.50', 
                p: 3, 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}>
                {/* Score */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <GaugeChart value={selectedEvaluation.evaluation.score} />
                </Box>

                {/* Ingredients */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    🥘 Ingredientes:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {selectedEvaluation.ingredients.map((ingredient, index) => (
                      <Chip 
                        key={index} 
                        label={ingredient.name} 
                        color="primary" 
                        variant="outlined" 
                        size="small"
                      />
                    ))}
                  </Stack>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Positives */}
                {selectedEvaluation.evaluation.positives.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" color="success.main" gutterBottom>
                      ✅ Aspectos Positivos
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {selectedEvaluation.evaluation.positives.map((positive, index) => (
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
                {selectedEvaluation.evaluation.issues.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" color="warning.main" gutterBottom>
                      ⚠️ Aspectos a Mejorar
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {selectedEvaluation.evaluation.issues.map((issue, index) => (
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
                {selectedEvaluation.evaluation.suggestions && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" color="info.main" gutterBottom>
                      💡 Sugerencias
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {selectedEvaluation.evaluation.suggestions}
                    </Typography>
                  </Box>
                )}

                {/* User Notes */}
                {selectedEvaluation.userNotes && (
                  <Box>
                    <Typography variant="h6" color="secondary.main" gutterBottom>
                      📝 Mis Notas
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {selectedEvaluation.userNotes}
                    </Typography>
                  </Box>
                )}

                {/* Date */}
                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary">
                    Guardado: {formatDate(selectedEvaluation.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            
            <DialogActions sx={{ 
              px: 3, 
              py: 2, 
              borderTop: '1px solid',
              borderColor: 'divider'
            }}>
              <Button 
                onClick={handleCloseDetailModal}
                variant="outlined"
              >
                Cerrar
              </Button>
              <Button 
                onClick={() => {
                  handleCloseDetailModal();
                  router.push('/plate-builder');
                }}
                variant="contained"
                startIcon={<span>🍽️</span>}
              >
                Crear Plato Similar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
    </MainLayout>

  );
};

export default FavoritesPage; 