import { MealLog } from "@/types/meals";
import restClient from "@/utils/restClient";
import dayjs from 'dayjs';
import 'dayjs/locale/es';

export const getDayLabel = (date: string) => {
  // date will be today, yesterday, last week or it will render just the date
  const today = dayjs();
  const yesterday = dayjs().subtract(1, 'day');
  const lastWeek = dayjs().subtract(7, 'day');
  const inputDate = dayjs(date);

  if (inputDate.isSame(today, 'day')) {
    return "Hoy";
  } else if (inputDate.isSame(yesterday, 'day')) {
    return "Ayer";
  } else if (inputDate.isSame(lastWeek, 'day')) {
    return "Semana pasada";
  } else {
    // format as Day - Month in spanish
    return inputDate.locale('es').format('DD - MMMM');
  }
}
  
export const groupLogsByDate = (logs: MealLog[]) => {
  return logs.reduce<{ [date: string]: MealLog[] }>((acc, log) => {
    if (!acc[log.date]) acc[log.date] = [];
    acc[log.date].push(log);
    return acc;
  }, {});
};

export const listMealLogs = async () => {
  const response = await restClient.get<MealLog[]>('/food-log');
  return response;
};

export const getMealLog = async (mealId: string) => {
  const response = await restClient.get<MealLog>(`/food-log/${mealId}`);
  return response;
};

export const translateMealType = (mealType: string) => {
  switch (mealType) {
    case 'breakfast':
      return 'Desayuno';
    case 'lunch':
      return 'Almuerzo';
    case 'dinner':
      return 'Cena';
    case 'snack':
      return 'Merienda';
    default:
      return mealType;
  }
}