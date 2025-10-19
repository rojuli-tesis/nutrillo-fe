"use client";

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AlertTitle,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  Snackbar,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Description as DocumentIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as ActiveIcon,
  History as HistoryIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import MainLayout from '../components/MainLayout';
import { userPlansService, UserPlan } from '@/services/userPlansService';
import { useUser } from '@/contexts/UserContext';

// Using UserPlan interface from the service
type Plan = UserPlan;

const PlansPage = () => {
  const { state: userState } = useUser();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // For nutrition plans, we don't have an active flag, so we'll show the most recent as active
  const activePlan = plans.length > 0 ? plans[0] : null;
  const historicalPlans = plans.slice(1); // All plans except the first one

  // Fetch plans on component mount
  useEffect(() => {
    if (userState.user?.id) {
      fetchPlans();
    }
  }, [userState.user?.id]);

  const fetchPlans = async () => {
    if (!userState.user?.id) {
      setError('Usuario no encontrado');
      setInitialLoading(false);
      return;
    }

    try {
      setInitialLoading(true);
      setError('');
      const userPlans = await userPlansService.getAllPlans(userState.user.id.toString());
      setPlans(userPlans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setError('Error al cargar los planes nutricionales. Por favor, intenta de nuevo.');
    } finally {
      setInitialLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setViewDialogOpen(true);
  };

  const handleDownloadPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setDownloadDialogOpen(true);
  };

  const confirmDownload = async () => {
    if (selectedPlan) {
      setLoading(true);
      try {
        const blob = await userPlansService.downloadPlan(selectedPlan._id);
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = selectedPlan.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        setSnackbarMessage('Plan descargado exitosamente');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error downloading plan:', error);
        setSnackbarMessage('Error al descargar el plan. Por favor, intenta de nuevo.');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
        setDownloadDialogOpen(false);
      }
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const PlanCard = ({ plan, isActive = false }: { plan: Plan; isActive?: boolean }) => (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: isActive ? '2px solid' : '1px solid',
        borderColor: isActive ? 'primary.main' : 'divider',
        position: 'relative'
      }}
    >
      {isActive && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1
          }}
        >
          <Chip
            icon={<ActiveIcon />}
            label="Activo"
            color="primary"
            size="small"
            variant="filled"
          />
        </Box>
      )}
      
      <CardContent sx={{ flexGrow: 1, pt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <DocumentIcon sx={{ mr: 1, mt: 0.5, color: 'primary.main' }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              Plan Nutricional
            </Typography>
            {plan.notes && (
              <Typography variant="body2" color="text.secondary" paragraph>
                {plan.notes}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CalendarIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {formatDate(plan.createdAt)}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          <strong>Archivo:</strong> {plan.fileName}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          size="small"
          startIcon={<ViewIcon />}
          onClick={() => handleViewPlan(plan)}
          variant="outlined"
        >
          Ver Plan
        </Button>
        <Button
          size="small"
          startIcon={<DownloadIcon />}
          onClick={() => handleDownloadPlan(plan)}
          variant="contained"
          color="primary"
        >
          Descargar
        </Button>
      </CardActions>
    </Card>
  );

  if (initialLoading) {
    return (
      <MainLayout>
        <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Cargando planes nutricionales...
            </Typography>
          </Box>
        </Container>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
          <Button variant="contained" onClick={fetchPlans}>
            Reintentar
          </Button>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Mis Planes Nutricionales
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Aquí puedes ver y descargar tus planes nutricionales personalizados
          </Typography>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab 
              label={`Plan Activo ${activePlan ? '(1)' : '(0)'}`} 
              icon={<ActiveIcon />}
              iconPosition="start"
            />
            <Tab 
              label={`Historial ${historicalPlans.length > 0 ? `(${historicalPlans.length})` : '(0)'}`}
              icon={<HistoryIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
            {activePlan ? (
              <PlanCard plan={activePlan} isActive={true} />
            ) : (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <DocumentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No hay plan activo
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tu nutricionista aún no ha asignado un plan nutricional activo.
                    Revisa el historial para ver planes anteriores.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            {historicalPlans.length > 0 ? (
              <Grid container spacing={3}>
                {historicalPlans.map((plan) => (
                  <Grid item xs={12} sm={6} md={4} key={plan._id}>
                    <PlanCard plan={plan} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <HistoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No hay planes anteriores
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Aquí aparecerán tus planes nutricionales anteriores cuando estén disponibles.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}

        {/* View Plan Dialog */}
        <Dialog 
          open={viewDialogOpen} 
          onClose={() => setViewDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Plan Nutricional
          </DialogTitle>
          <DialogContent>
            {selectedPlan && (
              <Box>
                {selectedPlan.notes && (
                  <Typography variant="body1" paragraph>
                    {selectedPlan.notes}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2" color="text.secondary">
                    Creado el {formatDate(selectedPlan.createdAt)}
                  </Typography>
                </Box>
  
                <Typography variant="body2" color="text.secondary">
                  <strong>Archivo:</strong> {selectedPlan.fileName}
                </Typography>
                
                <Alert severity="info" sx={{ mt: 2 }}>
                  <AlertTitle>Vista previa del plan</AlertTitle>
                  <Typography variant="body2">
                    Para ver el contenido completo del plan, descárgalo haciendo clic en el botón "Descargar".
                  </Typography>
                </Alert>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>
              Cerrar
            </Button>
            <Button 
              onClick={() => {
                setViewDialogOpen(false);
                if (selectedPlan) {
                  handleDownloadPlan(selectedPlan);
                }
              }}
              variant="contained"
              startIcon={<DownloadIcon />}
            >
              Descargar Plan
            </Button>
          </DialogActions>
        </Dialog>

        {/* Download Confirmation Dialog */}
        <Dialog 
          open={downloadDialogOpen} 
          onClose={() => setDownloadDialogOpen(false)}
        >
          <DialogTitle>
            Confirmar descarga
          </DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que quieres descargar "{selectedPlan?.fileName}"?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              El archivo se descargará a tu dispositivo.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDownloadDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={confirmDownload}
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : <DownloadIcon />}
            >
              {loading ? 'Descargando...' : 'Descargar'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </Container>
    </MainLayout>
  );
};

export default PlansPage;
