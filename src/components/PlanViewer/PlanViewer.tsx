import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  AlertTitle,
  AlertDescription,
  IconButton,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Description as DocumentIcon,
  CheckCircle as ActiveIcon,
} from '@mui/icons-material';

export interface Plan {
  id: string;
  title: string;
  uploadDate: string;
  isActive: boolean;
  fileName: string;
  fileSize: string;
  description: string;
  nutritionist: string;
}

interface PlanViewerProps {
  open: boolean;
  onClose: () => void;
  plan: Plan | null;
  onDownload?: (plan: Plan) => void;
  showDownloadButton?: boolean;
}

const PlanViewer: React.FC<PlanViewerProps> = ({
  open,
  onClose,
  plan,
  onDownload,
  showDownloadButton = true,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!plan) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '60vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <DocumentIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="span">
              {plan.title}
            </Typography>
            {plan.isActive && (
              <Chip
                icon={<ActiveIcon />}
                label="Activo"
                color="primary"
                size="small"
                sx={{ ml: 2 }}
              />
            )}
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" paragraph>
            {plan.description}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <List dense>
          <ListItem>
            <ListItemIcon>
              <CalendarIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Fecha de creación" 
              secondary={formatDate(plan.uploadDate)} 
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Nutricionista" 
              secondary={plan.nutritionist} 
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <DocumentIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Archivo" 
              secondary={`${plan.fileName} (${plan.fileSize})`} 
            />
          </ListItem>
        </List>

        <Alert severity="info" sx={{ mt: 3 }}>
          <AlertTitle>Vista previa del plan</AlertTitle>
          <AlertDescription>
            Para ver el contenido completo del plan, descárgalo haciendo clic en el botón "Descargar".
            El archivo PDF contiene todas las recomendaciones nutricionales personalizadas para ti.
          </AlertDescription>
        </Alert>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
        {showDownloadButton && onDownload && (
          <Button 
            onClick={() => onDownload(plan)}
            variant="contained"
            startIcon={<DownloadIcon />}
            color="primary"
          >
            Descargar Plan
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PlanViewer;
