'use client';
import * as React from 'react';
import { ToggleButtonGroup, ToggleButton, FormControl, FormLabel, FormHelperText, Box } from '@mui/material';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'high';

type Props = {
  name?: string;
  label?: string;
  value: ActivityLevel | '';
  onChange: (value: ActivityLevel) => void;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  errorText?: string;
};

const OPTIONS: { label: string; value: ActivityLevel }[] = [
  { label: 'Sedentario', value: 'sedentary' },
  { label: '1–3 días/semana', value: 'light' },
  { label: '3–5 días/semana', value: 'moderate' },
  { label: 'Alta intensidad', value: 'high' },
];

export default function ActivityLevelField({
  name = 'activityLevel',
  label = 'Nivel de actividad física',
  value,
  onChange,
  disabled,
  required,
  helperText = 'Elegí la opción que mejor represente tu frecuencia de ejercicio.',
  errorText,
}: Props) {
  const groupId = `${name}-group`;
  const helpId = `${name}-help`;

  const handleChange = (_: React.MouseEvent<HTMLElement>, newValue: ActivityLevel | null) => {
    if (newValue) onChange(newValue);
  };

  return (
    <FormControl component="fieldset" fullWidth error={Boolean(errorText)} disabled={disabled} required={required}>
      <FormLabel id={groupId} sx={{ mb: 1 }}>
        {label}
      </FormLabel>

      <Box
        role="group"
        aria-labelledby={groupId}
        aria-describedby={helpId}
        sx={{
          // Make the toggle group wrap nicely on small screens
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <ToggleButtonGroup
          value={value || null}
          exclusive
          onChange={handleChange}
          aria-label={label}
          sx={{
            // Let items wrap by placing each button in its own row flow
            display: 'flex',
            flexWrap: 'wrap',
            width: '100%',
            gap: 0, // Remove gap to prevent border issues
            '& .MuiToggleButton-root': {
              flex: { xs: '1 1 calc(50% - 1px)', sm: '0 0 auto' }, // Account for border width
              justifyContent: 'center',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              border: '1px solid #e0e0e0',
              margin: 0,
              '&:not(:first-of-type)': {
                borderLeft: '1px solid #e0e0e0',
              },
              '&.Mui-selected': {
                border: '1px solid #45BBA4',
                backgroundColor: '#45BBA4',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#3aa894',
                },
              },
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            },
          }}
        >
          {OPTIONS.map(opt => (
            <ToggleButton key={opt.value} value={opt.value} aria-label={opt.label}>
              {opt.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <FormHelperText id={helpId}>
        {errorText ? errorText : helperText}
      </FormHelperText>
    </FormControl>
  );
}
