"use client";

import React, { useEffect } from "react";
import {
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormControl,
  Box,
  CircularProgress,
} from "@mui/material";
import { RoutineDetails } from "@/utils/constants/registration";
import { Controller, useForm } from "react-hook-form";
import RegistrationStep from "@/app/components/registration/RegistrationStep";
import { useRegistrationData } from "@/hooks/useRegistrationData";

const RoutineFour = () => {
  const { getStepData, isLoading } = useRegistrationData();
  const existingData = getStepData("routine/four");

  const form = useForm<RoutineDetails>({
    defaultValues: {
      meriendaTime: 0,
      meriendaDetails: "",
      dinnerTime: 0,
      dinnerDetails: "",
      sleepTime: 0,
      stepName: "routine/four"
    },
  });

  // Update form values when existing data is loaded
  useEffect(() => {
    if (existingData) {
      form.reset({
        meriendaTime: existingData.meriendaTime || 0,
        meriendaDetails: existingData.meriendaDetails || "",
        dinnerTime: existingData.dinnerTime || 0,
        dinnerDetails: existingData.dinnerDetails || "",
        sleepTime: existingData.sleepTime || 0,
        stepName: "routine/four"
      });
    }
  }, [existingData, form]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <RegistrationStep
      stepName="routine/four"
      title="Rutina Diaria - Paso 4"
      subtitle="Por favor, completa la información sobre tu merienda, cena y horario de sueño"
      form={form}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="meriendaTime-label">Horario merienda</InputLabel>
            <Controller
              control={form.control}
              render={({ field }) => (
                <Select
                  labelId="meriendaTime-label"
                  id="meriendaTime"
                  label="Horario merienda"
                  displayEmpty
                  {...field}
                >
                  <MenuItem disabled value={0}>Selecciona una opción</MenuItem>
                  <MenuItem value={1}>No meriendo</MenuItem>
                  <MenuItem value={2}>15:00 a 17:00</MenuItem>
                  <MenuItem value={3}>17:00 a 19:00</MenuItem>
                  <MenuItem value={4}>Después de las 19:00</MenuItem>
                </Select>
              )}
              name="meriendaTime"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Describa su merienda"
            {...form.register("meriendaDetails")}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="dinnerTime-label">Horario de cena</InputLabel>
            <Controller
              control={form.control}
              render={({ field }) => (
                <Select
                  labelId="dinnerTime-label"
                  id="dinnerTime"
                  label="Horario de cena"
                  displayEmpty
                  {...field}
                >
                  <MenuItem disabled value={0}>Selecciona una opción</MenuItem>
                  <MenuItem value={1}>No ceno</MenuItem>
                  <MenuItem value={2}>19:00 a 21:00</MenuItem>
                  <MenuItem value={3}>21:00 a 23:00</MenuItem>
                  <MenuItem value={4}>Después de las 23:00</MenuItem>
                </Select>
              )}
              name="dinnerTime"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Describa su cena"
            {...form.register("dinnerDetails")}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="sleepTime-label">¿A qué hora se acuesta a dormir?</InputLabel>
            <Controller
              control={form.control}
              render={({ field }) => (
                <Select
                  labelId="sleepTime-label"
                  id="sleepTime"
                  label="¿A qué hora se acuesta a dormir?"
                  displayEmpty
                  {...field}
                >
                  <MenuItem disabled value={0}>Selecciona una opción</MenuItem>
                  <MenuItem value={1}>19:00 a 21:00</MenuItem>
                  <MenuItem value={2}>21:00 a 23:00</MenuItem>
                  <MenuItem value={3}>23:00 a 01:00</MenuItem>
                  <MenuItem value={4}>Después de 01:00</MenuItem>
                </Select>
              )}
              name="sleepTime"
            />
          </FormControl>
        </Grid>
      </Grid>
    </RegistrationStep>
  );
};

export default RoutineFour;
