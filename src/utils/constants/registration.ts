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
}

export interface PhysicalActivity {
  activityLevel: string;
  height: number;
  weight: number;
  dietType: string;
  stepName: string;
}

export interface HealthStatus {
  diagnosedIllness: string;
  medication: string;
  weightLossMeds: string;
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
  householdShopper: string;
  starvingHours: string;
  preferredFoods: string;
  dislikedFoods: string;
  breakfastTime: string;
  breakfastDetails: string;
  midMorningSnackTime: string;
  midMorningSnackDetails: string;
  lunchTime: string;
  lunchDetails: string;
  afternoonSnackTime: string;
  afternoonSnackDetails: string;
  meriendaTime: string;
  meriendaDetails: string;
  dinnerTime: string;
  dinnerDetails: string;
  sleepTime: string;
  stepName: string;
}

export interface ExtraDetails {
  sedentaryLevel: string;
  workouts: {
    type: string;
    frequency: string;
    duration: string;
    startingYear: number;
    place: string;
  }[];
  alcohol: string;
  smoking: string;
  supplements: string;
  stepName: string;
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
