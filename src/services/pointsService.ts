import restClient from '@/utils/restClient';

export interface PointsStatus {
  totalPoints: number;
  streaks: {
    mealLogging: {
      currentStreak: number;
      longestStreak: number;
      multiplier: number;
    };
    plateBuilder: {
      currentStreak: number;
      longestStreak: number;
      multiplier: number;
    };
  };
}

export interface PointTransaction {
  id: number;
  activityType: string;
  pointsEarned: number;
  streakMultiplier: number;
  basePoints: number;
  description: string;
  createdAt: Date;
}

export interface PointsHistory {
  transactions: PointTransaction[];
  total: number;
}

export interface DailyActivity {
  id: number;
  activityDate: string;
  activityType: string;
  mealLogCount: number;
  plateEvaluationCount: number;
  totalPointsEarned: number;
  averageMultiplier: number;
}

export interface CalendarMonth {
  year: number;
  month: number;
  activities: DailyActivity[];
}

export interface ActivityHistory {
  dailyActivities: DailyActivity[];
  streakHistory: any[]; // TODO: Define streak history interface
  totalActiveDays: number;
  longestStreak: number;
  averagePointsPerDay: number;
}

export const pointsService = {
  async getPointsStatus(): Promise<PointsStatus> {
    return restClient.get<PointsStatus>('/points/status');
  },

  async getPointsHistory(limit?: number): Promise<PointsHistory> {
    const url = limit ? `/points/history?limit=${limit}` : '/points/history';
    return restClient.get<PointsHistory>(url);
  },

  async getCalendarMonth(year: number, month: number): Promise<CalendarMonth> {
    return restClient.get<CalendarMonth>(`/points/calendar/${year}/${month}`);
  },

  async getActivityHistory(limit?: number): Promise<ActivityHistory> {
    const url = limit ? `/points/activity-history?limit=${limit}` : '/points/activity-history';
    return restClient.get<ActivityHistory>(url);
  },
};
