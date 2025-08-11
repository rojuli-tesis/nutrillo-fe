'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  IconButton,
  useTheme,
  Skeleton,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
} from '@mui/icons-material';
import { pointsService, CalendarMonth, DailyActivity } from '@/services/pointsService';

interface ActivityCalendarProps {
  initialYear?: number;
  initialMonth?: number;
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ 
  initialYear = new Date().getFullYear(),
  initialMonth = new Date().getMonth() + 1
}) => {
  const theme = useTheme();
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [calendarData, setCalendarData] = useState<CalendarMonth | null>(null);
  const [loading, setLoading] = useState(true);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        const data = await pointsService.getCalendarMonth(currentYear, currentMonth);
        setCalendarData(data);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [currentYear, currentMonth]);

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const isDayActive = (day: number): boolean => {
    if (!calendarData) return false;
    
    const dateString = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return calendarData.activities.some(activity => activity.activityDate === dateString);
  };

  const getActivityInfo = (day: number): DailyActivity | null => {
    if (!calendarData) return null;
    
    const dateString = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return calendarData.activities.find(activity => activity.activityDate === dateString) || null;
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return today.getFullYear() === currentYear && 
           today.getMonth() + 1 === currentMonth && 
           today.getDate() === day;
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<Box key={`empty-${i}`} sx={{ height: 40 }} />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const active = isDayActive(day);
      const today = isToday(day);
      const activityInfo = getActivityInfo(day);

      days.push(
        <Box
          key={day}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
            borderRadius: 1,
            bgcolor: today 
              ? theme.palette.primary.light 
              : active 
                ? theme.palette.success.light
                : 'transparent',
            border: today 
              ? `2px solid ${theme.palette.primary.main}` 
              : active 
                ? `1px solid ${theme.palette.success.main}`
                : 'none',
            position: 'relative',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: active 
                ? theme.palette.success.main 
                : theme.palette.action.hover,
            }
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.7rem',
              fontWeight: today ? 'bold' : 'normal',
              color: today ? 'white' : 'text.primary',
            }}
          >
            {day}
          </Typography>
          {active && (
            <CheckCircleIcon
              sx={{
                position: 'absolute',
                top: -2,
                right: -2,
                fontSize: 12,
                color: theme.palette.success.main,
              }}
            />
          )}
          {activityInfo && (
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.6rem',
                color: 'text.secondary',
                mt: -0.5,
              }}
            >
              {activityInfo.totalPointsEarned}p
            </Typography>
          )}
        </Box>
      );
    }

    return days;
  };

  if (loading) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
          <Grid container spacing={1}>
            {Array.from({ length: 42 }).map((_, i) => (
              <Grid item xs key={i}>
                <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <IconButton onClick={handlePreviousMonth} size="small">
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6" component="h2">
            {monthNames[currentMonth - 1]} {currentYear}
          </Typography>
          <IconButton onClick={handleNextMonth} size="small">
            <ChevronRightIcon />
          </IconButton>
        </Box>

        {/* Day names */}
        <Grid container spacing={1} sx={{ mb: 1 }}>
          {dayNames.map((day) => (
            <Grid item xs key={day}>
              <Box sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  {day}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Calendar days */}
        <Grid container spacing={1}>
          {renderCalendarDays().map((day, index) => (
            <Grid item xs key={index}>
              {day}
            </Grid>
          ))}
        </Grid>

        {/* Legend */}
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CheckCircleIcon sx={{ fontSize: 16, color: theme.palette.success.main }} />
            <Typography variant="caption" color="text.secondary">
              Día activo
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ 
              width: 16, 
              height: 16, 
              borderRadius: 1, 
              bgcolor: theme.palette.primary.light,
              border: `1px solid ${theme.palette.primary.main}`
            }} />
            <Typography variant="caption" color="text.secondary">
              Hoy
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActivityCalendar;

