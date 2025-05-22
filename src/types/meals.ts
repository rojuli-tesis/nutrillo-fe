export type MealType = 'breakfast' | 'morningSnack' | 'lunch' | 'afternoonSnack' | 'dinner' | 'eveningSnack';

export interface MealTypeInfo {
  id: MealType;
  label: string;
  timeRange: {
    start: number; // hour in 24h format
    end: number;
  };
}

export const MEAL_TYPES: MealTypeInfo[] = [
  { 
    id: 'breakfast', 
    label: 'Desayuno',
    timeRange: { start: 6, end: 10 }
  },
  { 
    id: 'morningSnack', 
    label: 'Media mañana',
    timeRange: { start: 10, end: 12 }
  },
  { 
    id: 'lunch', 
    label: 'Almuerzo',
    timeRange: { start: 12, end: 15 }
  },
  { 
    id: 'afternoonSnack', 
    label: 'Merienda',
    timeRange: { start: 15, end: 18 }
  },
  { 
    id: 'dinner', 
    label: 'Cena',
    timeRange: { start: 18, end: 22 }
  },
  { 
    id: 'eveningSnack', 
    label: 'Colación nocturna',
    timeRange: { start: 22, end: 24 }
  }
];

export interface MealLog {
  _id: string;
  userId: string;
  date: string;
  mealType: MealType;
  description?: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export function getSuggestedMealType(hour: number): MealType {
  const meal = MEAL_TYPES.find(
    meal => hour >= meal.timeRange.start && hour < meal.timeRange.end
  );
  
  // Default to lunch if no meal type matches the current hour
  return meal?.id || 'lunch';
} 