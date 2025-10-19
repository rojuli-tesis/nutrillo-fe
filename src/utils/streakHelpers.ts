import {  DailyActivity } from '@/services/pointsService';

export interface WeekDay {
  name: string;
  date: Date;
  isToday: boolean;
  isPast: boolean;
}

/**
 * Get the current week's days (Sunday to Saturday)
 */
export const getWeekDays = (): WeekDay[] => {
  const days = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const today = new Date();
  const weekDays: WeekDay[] = [];
  
  // Get the start of the current week (Sunday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDays.push({
      name: days[i],
      date: date,
      isToday: date.toDateString() === today.toDateString(),
      isPast: date <= today,
    });
  }
  
  return weekDays;
};

/**
 * Check if a specific date was active based on actual daily activity data
 */
export const isDayActive = (date: Date, dailyActivities: DailyActivity[]): boolean => {
  if (!dailyActivities || dailyActivities.length === 0) return false;
  
  const dateString = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
  // Check if there's a daily activity record for this date
  return dailyActivities.some(activity => activity.activityDate === dateString);
};

/**
 * Calculate streak multiplier based on current streak
 * Base: 1.0x, +0.1x per day, max 3.0x
 */
export const calculateStreakMultiplier = (streakDays: number): number => {
  const multiplier = 1.0 + (streakDays * 0.1);
  return Math.min(multiplier, 3.0);
};

/**
 * Get encouraging message based on active days count
 */
export const getEncouragementMessage = (activeDays: number): string => {
  if (activeDays === 1) return "¡Comienza tu racha hoy!";
  if (activeDays < 7) return "¡Mantene la racha!";
  return "¡Semana perfecta! 🎉";
};

/**
 * Calculate total active days for the week
 */
export const getActiveDaysCount = (weekDays: WeekDay[], dailyActivities: DailyActivity[]): number => {
  return weekDays.filter(day => isDayActive(day.date, dailyActivities)).length;
};
