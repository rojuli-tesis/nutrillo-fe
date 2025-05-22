'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import { MealType, MEAL_TYPES } from '@/types/meals';
import dayjs, { Dayjs } from 'dayjs';
import dynamic from 'next/dynamic';

interface MealLogFormProps {
  initialDate?: Date;
  initialTime?: number;
  initialMealType?: MealType;
  onSubmit: (data: FormData) => Promise<void>;
}

const isDateToday = (date: Dayjs) => {
  return date.isSame(dayjs(), 'day');
};

const isDateYesterday = (date: Dayjs) => {
  return date.isSame(dayjs().subtract(1, 'day'), 'day');
};

const TimeSelect = dynamic(
  () => Promise.resolve(({ value, onChange }: { value: number; onChange: (value: number) => void }) => (
    <Select
      value={value}
      label="Hora"
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {Array.from({ length: 24 }, (_, i) => (
        <MenuItem key={i} value={i}>
          {i.toString().padStart(2, '0')}:00
        </MenuItem>
      ))}
    </Select>
  )),
  { ssr: false }
);

export const MealLogForm: React.FC<MealLogFormProps> = ({
  initialDate = new Date(),
  initialTime = 12,
  initialMealType,
  onSubmit,
}) => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [date, setDate] = useState<Dayjs>(() => dayjs(initialDate).startOf('day'));
  const [isYesterday, setIsYesterday] = useState(false);
  const [isToday, setIsToday] = useState(false);
  const [time, setTime] = useState<number>(initialTime);
  const [mealType, setMealType] = useState<MealType>(initialMealType || MEAL_TYPES[0].id);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTime(new Date().getHours());
  }, []);

  useEffect(() => {
    setIsToday(isDateToday(date));
    setIsYesterday(isDateYesterday(date));
  }, [date]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSetYesterday = () => {
    setDate(dayjs().subtract(1, 'day').startOf('day'));
  };

  const handleSetToday = () => {
    setDate(dayjs().startOf('day'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description && !photo) {
      setError('Debes incluir una descripción o una foto');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append('date', date.toISOString());
      // TOOD: hour is not being applied to the date - need to fix
      formData.append('time', time.toString());
      formData.append('mealType', mealType);
      formData.append('description', description);
      if (photo) {
        formData.append('photo', photo);
      }

      await onSubmit(formData);
    } catch (err) {
      setError('Error al guardar el registro. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} alignItems="center">
              <DatePicker
                label="Fecha"
                value={date}
                onChange={(newDate) => {
                  if (newDate) {
                    setDate(newDate);
                  }
                }}
                disabled={isYesterday}
                sx={{ flex: 1 }}
              />
              <Button
                variant={isYesterday ? "contained" : "outlined"}
                onClick={handleSetYesterday}
                sx={{ height: '56px' }}
              >
                Ayer
              </Button>
              <Button
                variant={isToday ? "contained" : "outlined"}
                onClick={handleSetToday}
                sx={{ height: '56px' }}
              >
                Hoy
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Hora</InputLabel>
              <TimeSelect value={time} onChange={setTime} />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Comida</InputLabel>
              <Select
                value={mealType}
                label="Comida"
                onChange={(e) => setMealType(e.target.value as MealType)}
              >
                {MEAL_TYPES.map((meal) => (
                  <MenuItem key={meal.id} value={meal.id}>
                    {meal.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!photo && !description}
              helperText={!photo && !description ? 'Requerido si no hay foto' : ''}
            />
          </Grid>

          <Grid item xs={12}>
            <input
              ref={fileInputRef}
              accept="image/*"
              type="file"
              hidden
              onChange={handlePhotoChange}
            />
            
            {!photoPreview ? (
              <Button
                variant="outlined"
                startIcon={<PhotoCamera />}
                onClick={() => fileInputRef.current?.click()}
                fullWidth
                sx={{ height: '100px' }}
              >
                Agregar foto
              </Button>
            ) : (
              <Box sx={{ position: 'relative' }}>
                <img
                  src={photoPreview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: theme.shape.borderRadius,
                  }}
                />
                <IconButton
                  onClick={handleRemovePhoto}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'background.paper',
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar registro'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Card>
  );
}; 