export const steps = [
  "personalData",
  "currentStatus",
  "healthStatus",
  "diet/one",
  "diet/two",
  "diet/three",
  "diet/four",
  "routine/one",
  "routine/two",
  "routine/three",
  "routine/four",
  "exercise",
  "lifestyle",
];

export interface PersonalData {
  firstName: string;
  lastName: string;
  dob: Date;
  objectives: string;
  stepName?: string;
}

export interface PhysicalActivity {
  activityLevel: string;
  height: number;
  weight: number;
  dietType: string;
  stepName: string;
}

export interface HealthStatus {
  diagnosedIllness: number;
  medication: number;
  weightLossMeds: number;
  stepName: string;
}

export interface DietDetails {
  liquids: string[];
  sweets: string[];
  snacks: string[];
  sweeteners: string[];
  fats: string[];
  dairy: string[];
  stepName: string;
}

export interface RoutineDetails {
  mealsADay: number;
  householdShopper: number;
  starvingHours: number;
  preferredFoods: string;
  dislikedFoods: string;
  breakfastTime: number;
  breakfastDetails: string;
  midMorningSnackTime: number;
  midMorningSnackDetails: string;
  lunchTime: number;
  lunchDetails: string;
  afternoonSnackTime: number;
  afternoonSnackDetails: string;
  meriendaTime: number;
  meriendaDetails: string;
  dinnerTime: number;
  dinnerDetails: string;
  sleepTime: number;
  stepName: string;
}

export interface ExtraDetails {
  sedentaryLevel: 'sedentary' | 'light' | 'moderate' | 'high' | '';
  workouts: {
    name: string;
    frequency: string;
    duration: string;
    startingYear: string;
    place: string;
  }[];
  alcohol: number;
  alcoholDetails: string;
  smoking: number;
  smokingDetails: string;
  supplements: number;
  supplementsDetails: string;
  stepName: string;
}

export interface Workout {
  name: string;
  frequency: string;
  duration: string;
  startingYear: string;
  place: string;
}

export enum RegistrationSteps {
  PersonalData = "personal-data",
  PhysicalActivity = "physical-activity",
  HealthStatus = "health-status",
  DietDetails = "diet-details",
  RoutineDetails = "routine-details",
  ExtraDetails = "extra-details",
}

export type RegistrationStep =
  | PersonalData
  | PhysicalActivity
  | HealthStatus
  | DietDetails
  | RoutineDetails
  | ExtraDetails;
