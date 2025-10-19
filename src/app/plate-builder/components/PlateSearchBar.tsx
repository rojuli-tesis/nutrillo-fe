'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  TextField,
  Button,
  Collapse,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import { PlateFilters, PlateFiltersProps } from './PlateFilters';

export interface PlateSearchValue {
  q: string;
  type?: string;
  subtype?: string;
}

export interface PlateSearchBarProps {
  value: PlateSearchValue;
  onChange: (value: PlateSearchValue) => void;
  filtersOpen: boolean;
  onToggleFilters: () => void;
  types: string[];
  subtypes: string[];
}

export const PlateSearchBar: React.FC<PlateSearchBarProps> = ({
  value,
  onChange,
  filtersOpen,
  onToggleFilters,
  types,
  subtypes,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchInput, setSearchInput] = useState(value.q);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ ...value, q: searchInput });
    }, 200);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Sync external value changes
  useEffect(() => {
    setSearchInput(value.q);
  }, [value.q]);

  const handleFilterChange = (filters: { type?: string; subtype?: string }) => {
    onChange({ ...value, ...filters });
  };

  const handleClearFilters = () => {
    onChange({ q: '', type: 'all', subtype: 'all' });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    onChange({ ...value, q: '' });
  };

  const hasActiveFilters = value.type !== 'all' || value.subtype !== 'all';
  const hasSearchText = !!searchInput.trim();

  return (
    <Box
      sx={{
        py: 1.5,
      }}
    >
      <Stack spacing={1.5}>
        {/* Search Input + Filters Button (Mobile) or Inline Filters (Desktop) */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="flex-start"
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar ingrediente"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Buscar ingrediente"
            InputProps={{
              endAdornment: hasSearchText ? (
                <Button
                  size="small"
                  onClick={handleClearSearch}
                  sx={{
                    minWidth: 'auto',
                    width: '24px',
                    height: '24px',
                    p: 0,
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                  aria-label="Limpiar búsqueda"
                >
                  <ClearIcon fontSize="small" />
                </Button>
              ) : null,
            }}
            sx={{
              minWidth: 0,
              '& .MuiInputBase-root': {
                minHeight: '44px', // Touch target
              },
            }}
          />
          
          {isMobile ? (
            <>
              <Button
                variant={filtersOpen ? 'contained' : 'outlined'}
                onClick={onToggleFilters}
                startIcon={<TuneIcon />}
                aria-label="Alternar filtros"
                aria-expanded={filtersOpen}
                sx={{
                  minWidth: '44px',
                  minHeight: '44px',
                  flexShrink: 0,
                }}
              >
                Filtros
              </Button>
              
              {/* Trash icon to clear filters */}
              {hasActiveFilters && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClearFilters}
                  sx={{
                    minWidth: '44px',
                    minHeight: '44px',
                    flexShrink: 0,
                    borderColor: 'error.main',
                    color: 'error.main',
                    '&:hover': {
                      borderColor: 'error.dark',
                      backgroundColor: 'error.light',
                      color: 'error.dark',
                    },
                  }}
                  aria-label="Limpiar filtros"
                >
                  <DeleteIcon fontSize="small" />
                </Button>
              )}
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, minWidth: 400 }}>
              <PlateFilters
                type={value.type}
                subtype={value.subtype}
                onChange={handleFilterChange}
                inline
                types={types}
                subtypes={subtypes}
              />
              
              {/* Trash icon to clear filters */}
              {hasActiveFilters && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClearFilters}
                  sx={{
                    minWidth: '44px',
                    minHeight: '44px',
                    flexShrink: 0,
                    borderColor: 'error.main',
                    color: 'error.main',
                    '&:hover': {
                      borderColor: 'error.dark',
                      backgroundColor: 'error.light',
                      color: 'error.dark',
                    },
                  }}
                  aria-label="Limpiar filtros"
                >
                  <DeleteIcon fontSize="small" />
                </Button>
              )}
            </Box>
          )}
        </Stack>

        {/* Collapsible Filters (Mobile Only) */}
        {isMobile && (
          <Collapse in={filtersOpen}>
            <PlateFilters
              type={value.type}
              subtype={value.subtype}
              onChange={handleFilterChange}
              inline={false}
              types={types}
              subtypes={subtypes}
            />
          </Collapse>
        )}
      </Stack>
    </Box>
  );
};
