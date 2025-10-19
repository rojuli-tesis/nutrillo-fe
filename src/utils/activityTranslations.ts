/**
 * Translation helper for activity descriptions
 */
export const translateActivityDescription = (description: string): string => {
  // Handle meal log descriptions
  if (description.includes('Meal log')) {
    if (description.includes('with photo')) {
      return 'Registro de comida con foto';
    }
    return 'Registro de comida';
  }

  // Handle plate evaluation descriptions
  if (description.includes('Plate evaluation')) {
    if (description.includes('high score')) {
      return 'Evaluación de plato (puntuación alta)';
    }
    return 'Evaluación de plato';
  }

  // Handle recipe recommendation descriptions
  if (description.includes('Recipe recommendations generated')) {
    if (description.includes('from evaluation')) {
      return 'Recetas generadas desde evaluación';
    }
    return 'Recetas generadas';
  }

  // Handle streak bonus descriptions
  if (description.includes('Streak bonus')) {
    return 'Bono de racha';
  }

  // Return original description if no translation found
  return description;
};
