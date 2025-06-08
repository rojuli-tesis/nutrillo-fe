import { PlateIngredient } from '@/types/plate-ingredient';

// Get unique types from ingredients
export const getUniqueTypes = (ingredients: PlateIngredient[]): string[] => {
  return ['all', ...ingredients
    .map(ing => ing.type.label)
    .filter((value, index, self) => self.indexOf(value) === index)
  ];
};

// Get unique subtypes filtered by selected type
export const getFilteredSubtypes = (
  ingredients: PlateIngredient[],
  selectedType: string
): string[] => {
  return ['all', ...ingredients
    .filter(ing => selectedType === 'all' || ing.type.label === selectedType)
    .map(ing => ing.subtype?.label)
    .filter((value): value is string => Boolean(value))
    .filter((value, index, self) => self.indexOf(value) === index)
  ];
};

// Filter ingredients based on selected type and subtype
export const filterIngredients = (
  ingredients: PlateIngredient[],
  selectedType: string,
  selectedSubtype: string
): PlateIngredient[] => {
  return ingredients.filter(ingredient => {
    const typeMatch = selectedType === 'all' || ingredient.type.label === selectedType;
    const subtypeMatch = selectedSubtype === 'all' || ingredient.subtype?.label === selectedSubtype;
    return typeMatch && subtypeMatch;
  });
}; 