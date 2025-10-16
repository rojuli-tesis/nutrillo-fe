'use client';

import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';

export interface PlateFiltersProps {
  type?: string;
  subtype?: string;
  onChange: (filters: { type?: string; subtype?: string }) => void;
  inline?: boolean;
  types: string[];
  subtypes: string[];
}

export const PlateFilters: React.FC<PlateFiltersProps> = ({
  type = 'all',
  subtype = 'all',
  onChange,
  inline = false,
  types,
  subtypes,
}) => {
  const handleTypeChange = (newType: string) => {
    onChange({ type: newType, subtype: 'all' });
  };

  const handleSubtypeChange = (newSubtype: string) => {
    onChange({ type, subtype: newSubtype });
  };

  return (
    <Stack
      direction={inline ? 'row' : 'column'}
      spacing={2}
      sx={{ width: '100%' }}
    >
      <FormControl fullWidth size="small">
        <InputLabel id="plate-filter-type-label">Tipo</InputLabel>
        <Select
          labelId="plate-filter-type-label"
          id="plate-filter-type"
          value={type}
          label="Tipo"
          onChange={(e) => handleTypeChange(e.target.value)}
          aria-label="Filtrar por tipo de ingrediente"
        >
          <MenuItem value="all">Todos</MenuItem>
          {types.filter(t => t !== 'all').map((typeOption) => (
            <MenuItem key={typeOption} value={typeOption}>
              {typeOption}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel id="plate-filter-subtype-label">Subtipo</InputLabel>
        <Select
          labelId="plate-filter-subtype-label"
          id="plate-filter-subtype"
          value={subtype}
          label="Subtipo"
          onChange={(e) => handleSubtypeChange(e.target.value)}
          disabled={subtypes.length <= 1}
          aria-label="Filtrar por subtipo de ingrediente"
        >
          <MenuItem value="all">Todos</MenuItem>
          {subtypes.filter(st => st !== 'all').map((subtypeOption) => (
            <MenuItem key={subtypeOption} value={subtypeOption}>
              {subtypeOption}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};
