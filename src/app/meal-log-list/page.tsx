"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
  Divider,
  Fab,
  CircularProgress,
} from "@mui/material";
import MainLayout from "../components/MainLayout";
import { getDayLabel, groupLogsByDate, listMealLogs, translateMealType } from "./helpers";
import { MealLog } from "@/types/meals";
import MealCard from "./components/MealCard";
import AddIcon from '@mui/icons-material/Add';
import ArrowBack from "@mui/icons-material/ArrowBack";


const FILTERS = [
  { label: "Todos", value: "all" },
  { label: "Hoy", value: "today" },
  { label: "Ayer", value: "yesterday" },
  { label: "7 dias", value: "thisWeek" },
  { label: "14 dias", value: "lastWeek" },
];

// Helper to flatten logs object to array
const flattenLogs = (logsObj: { [date: string]: MealLog[] }) =>
  Object.values(logsObj).flat();

// Helper to filter logs by filter value
const filterLogs = (logs: MealLog[], filter: string) => {
  if (filter === 'all') return logs;
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const startOfLastWeek = new Date(today);
  startOfLastWeek.setDate(startOfWeek.getDate() - 7);
  const endOfLastWeek = new Date(today);
  endOfLastWeek.setDate(startOfWeek.getDate() - 1);

  return logs.filter((log) => {
    const logDate = new Date(log.date);
    switch (filter) {
      case "today":
        return logDate.toDateString() === today.toDateString();
      case "yesterday":
        return logDate.toDateString() === yesterday.toDateString();
      case "thisWeek":
        return logDate >= startOfWeek && logDate <= today;
      case "lastWeek": // 14 days ago from today 
      // should show today, yesterday and the 12 days before
      const startOfLastWeek = new Date(today);
      startOfLastWeek.setDate(today.getDate() - 14);
      return logDate >= startOfLastWeek && logDate <= today;
    
      default:
        return true;
    }
  });
};

const MealLogListPage = () => {
    const [logs, setLogs] = useState<{ [date: string]: MealLog[] }>({});
    const [selectedFilter, setSelectedFilter] = useState("thisWeek");
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
    const fetchLogs = async () => {
      const logs = await listMealLogs();
      setLogs(groupLogsByDate(logs));
      setIsLoading(false);
    };
    fetchLogs();
  }, []);

  // Flatten, filter, and regroup logs
  const allLogs = flattenLogs(logs);
  const filteredLogs = filterLogs(allLogs, selectedFilter);
  const groupedFilteredLogs = groupLogsByDate(filteredLogs);
  const hasLogs = filteredLogs.length > 0;


  return (
    <MainLayout>
      <Container maxWidth="sm" sx={{ py: 1 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <Button variant="text" color="inherit" href="/home" sx={{ minWidth: 0, p: 0 }}>
            <ArrowBack />
          </Button>
          <Typography variant="h5" component="h1">
            Registros
          </Typography>
        </Stack>
        {/* floating CTA to add new meal */}
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
          <a href="/meal-log" style={{ textDecoration: 'none' }}>
            <Fab color="secondary" aria-label="add">
              <AddIcon />
            </Fab>
          </a>
        </Box>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
        {/* Filters */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          {FILTERS.map((filter) => (
            <Button
              key={filter.value}
              variant={selectedFilter === filter.value ? "contained" : "outlined"}
              onClick={() => setSelectedFilter(filter.value)}
              size="small"
            >
              {filter.label}
            </Button>
          ))}
        </Stack>
        <Divider sx={{ mb: 3 }} />
        {/* Empty State */}
        {!hasLogs && (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No hay comidas registradas aun.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Registra tu primera comida!
            </Typography>
            <Button variant="contained" color="primary" href="/meal-log">
              Registrar
            </Button>
          </Box>
        )}

        {/* Meal Logs by Day */}
        {hasLogs && Object.entries(groupedFilteredLogs).map(([date, logs]) => (
          <Box key={date} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 1, textTransform: 'capitalize' }}>
              {getDayLabel(date)}
           
            </Typography>
            <Stack spacing={2}>
              {logs.map((log) => (
                <MealCard key={log._id} log={log} />
              ))}
            </Stack>
          </Box>
        ))}

        {/* Streaks Placeholder */}
        {/* <Box sx={{ mt: 6 }}>
          <Card sx={{ p: 3, background: "#6C4FF6", color: "#fff", borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              🔥 7 Day Streak!
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              You've logged meals for 7 days in a row. Keep it up!
            </Typography>
            <Button variant="contained" sx={{ background: "#FFD600", color: "#333", fontWeight: 700 }}>
              Streak Bonus +50 coins
            </Button>
          </Card>
        </Box> */}
      </>
      )}
      </Container>
    </MainLayout>
  );
};

export default MealLogListPage; 