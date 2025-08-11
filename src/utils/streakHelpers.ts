import { PointsStatus } from '@/services/pointsService';

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
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
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
 * Check if a specific date was active based on current streak data
 * Note: This is a simplified approach. In a real app, you'd want to track daily activity
 */
export const isDayActive = (date: Date, pointsStatus: PointsStatus | null): boolean => {
  if (!pointsStatus) return false;
  
  const today = new Date();
  
  // Check if this date is in the last 7 days and user has activity
  const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff < 0 || daysDiff >= 7) return false;
  
  // For today, check if user has any activity (streaks > 0)
  if (daysDiff === 0) {
    return pointsStatus.streaks.mealLogging.currentStreak > 0 || 
           pointsStatus.streaks.plateBuilder.currentStreak > 0;
  }
  
  // For past days, we can't determine exactly, but we can show based on current streak
  const mealStreak = pointsStatus.streaks.mealLogging.currentStreak;
  const plateStreak = pointsStatus.streaks.plateBuilder.currentStreak;
  
  // If user has a streak, assume they were active in recent days
  return (mealStreak > 0 && daysDiff < mealStreak) || 
         (plateStreak > 0 && daysDiff < plateStreak);
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
  if (activeDays === 0) return "¡Comienza tu racha hoy!";
  if (activeDays < 7) return "¡Mantene la racha!";
  return "¡Semana perfecta! 🎉";
};

/**
 * Calculate total active days for the week
 */
export const getActiveDaysCount = (weekDays: WeekDay[], pointsStatus: PointsStatus | null): number => {
  return weekDays.filter(day => isDayActive(day.date, pointsStatus)).length;
};
