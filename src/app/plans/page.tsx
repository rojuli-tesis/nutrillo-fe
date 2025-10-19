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

// Mock data for demonstration
const mockPlans = [
  {
    id: '1',
    title: 'Plan Nutricional - Enero 2024',
    uploadDate: '2024-01-15',
    isActive: true,
    fileName: 'plan_enero_2024.pdf',
    description: 'Plan nutricional personalizado para el mes de enero, enfocado en objetivos de pérdida de peso y mejora de hábitos alimentarios.',
    nutritionist: 'Dra. María González'
  },
  {
    id: '2',
    title: 'Plan de Alimentación Saludable',
    uploadDate: '2024-01-10',
    isActive: false,
    fileName: 'plan_saludable.pdf',
    description: 'Plan general de alimentación saludable con recomendaciones para mantener un estilo de vida equilibrado.',
    nutritionist: 'Dra. María González'
  },
  {
    id: '3',
    title: 'Plan Nutricional - Diciembre 2023',
    uploadDate: '2023-12-20',
    isActive: false,
    fileName: 'plan_diciembre_2023.pdf',
    description: 'Plan nutricional para las fiestas de fin de año, con recomendaciones especiales para mantener los objetivos durante las celebraciones.',
    nutritionist: 'Dra. María González'
  }
];

interface Plan {
  id: string;
  title: string;
  uploadDate: string;
  isActive: boolean;
  fileName: string;
  description: string;
  nutritionist: string;
}

const PlansPage = () => {
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const activePlan = plans.find(plan => plan.isActive);
  const historicalPlans = plans.filter(plan => !plan.isActive);

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

  const confirmDownload = () => {
    if (selectedPlan) {
      setLoading(true);
      // TODO: Implement actual download functionality
      setTimeout(() => {
        setLoading(false);
        setDownloadDialogOpen(false);
        // Show success message
      }, 2000);
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
              {plan.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {plan.description}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CalendarIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {formatDate(plan.uploadDate)}
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
                  <Grid item xs={12} sm={6} md={4} key={plan.id}>
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
            {selectedPlan?.title}
          </DialogTitle>
          <DialogContent>
            {selectedPlan && (
              <Box>
                <Typography variant="body1" paragraph>
                  {selectedPlan.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2" color="text.secondary">
                    Creado el {formatDate(selectedPlan.uploadDate)}
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
              ¿Estás seguro de que quieres descargar "{selectedPlan?.title}"?
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
      </Container>
    </MainLayout>
  );
};

export default PlansPage;
