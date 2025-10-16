'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Stack,
  useTheme,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const HELP_STORAGE_KEY = 'nutrillo:plate:hideHelp';

export const PlateHeader: React.FC = () => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // Check if we should show the help dialog on first load
    const hideHelp = localStorage.getItem(HELP_STORAGE_KEY);
    if (!hideHelp) {
      // Optionally auto-show on first visit
      // setDialogOpen(true);
    }
  }, []);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (dontShowAgain) {
      localStorage.setItem(HELP_STORAGE_KEY, 'true');
    }
    setDialogOpen(false);
    setDontShowAgain(false);
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Build your Plate
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Arrastrá al menos 3 ingredientes para armar tu plato.
          </Typography>
        </Box>
        <IconButton
          onClick={handleOpenDialog}
          aria-label="Información sobre cómo armar tu plato"
          sx={{
            ml: 1,
            color: theme.palette.primary.main,
          }}
        >
          <InfoOutlinedIcon />
        </IconButton>
      </Stack>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        aria-labelledby="help-dialog-title"
      >
        <DialogTitle id="help-dialog-title">
          ¿Cómo armar tu plato?
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body1">
              Construye tu plato perfecto arrastrando y soltando ingredientes en el plato.
            </Typography>
            <Typography variant="body1">
              <strong>Pasos:</strong>
            </Typography>
            <Box component="ol" sx={{ pl: 2, m: 0 }}>
              <li>
                <Typography variant="body2">
                  Busca ingredientes usando el buscador o los filtros
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Arrastra los ingredientes que desees al plato (o presiona Enter en teclado)
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Necesitas al menos 3 ingredientes para evaluar tu plato
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Una vez que tengas 3 o más ingredientes, presiona "Evaluar Plato"
                </Typography>
              </li>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Puedes remover ingredientes haciendo clic en ellos dentro del plato o presionando Delete con el teclado.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
            }
            label="No mostrar de nuevo"
            sx={{ alignSelf: 'flex-start' }}
          />
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            fullWidth
          >
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
