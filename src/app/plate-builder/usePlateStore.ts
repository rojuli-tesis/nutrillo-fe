'use client';

import { create } from 'zustand';
import { PlateIngredient } from '@/types/plate-ingredient';

export interface PlateSearchValue {
  q: string;
  type?: string;
  subtype?: string;
}

interface PlateStore {
  // Selected ingredients on the plate
  selectedIngredients: PlateIngredient[];
  
  // Search and filter state
  searchValue: PlateSearchValue;
  filtersOpen: boolean;
  
  // Actions
  addIngredient: (ingredient: PlateIngredient) => void;
  removeIngredient: (index: number) => void;
  clearPlate: () => void;
  setSelectedIngredients: (ingredients: PlateIngredient[]) => void;
  setSearchValue: (value: PlateSearchValue) => void;
  setFiltersOpen: (open: boolean) => void;
  toggleFilters: () => void;
}

export const usePlateStore = create<PlateStore>((set) => ({
  selectedIngredients: [],
  searchValue: { q: '', type: 'all', subtype: 'all' },
  filtersOpen: false,
  
  addIngredient: (ingredient) =>
    set((state) => ({
      selectedIngredients: [...state.selectedIngredients, ingredient],
    })),
    
  removeIngredient: (index) =>
    set((state) => ({
      selectedIngredients: state.selectedIngredients.filter((_, i) => i !== index),
    })),
    
  clearPlate: () =>
    set({
      selectedIngredients: [],
    }),
    
  setSelectedIngredients: (ingredients) =>
    set({
      selectedIngredients: ingredients,
    }),
    
  setSearchValue: (value) =>
    set({
      searchValue: value,
    }),
    
  setFiltersOpen: (open) =>
    set({
      filtersOpen: open,
    }),
    
  toggleFilters: () =>
    set((state) => ({
      filtersOpen: !state.filtersOpen,
    })),
}));
