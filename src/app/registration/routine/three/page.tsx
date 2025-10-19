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

const RoutineThree = () => {
  const { getStepData, isLoading } = useRegistrationData();
  const existingData = getStepData("routine/three");

  const form = useForm<RoutineDetails>({
    defaultValues: {
      lunchTime: 0,
      lunchDetails: "",
      afternoonSnackTime: 0,
      afternoonSnackDetails: "",
      stepName: "routine/three"
    },
  });

  // Update form values when existing data is loaded
  useEffect(() => {
    if (existingData) {
      form.reset({
        lunchTime: existingData.lunchTime || 0,
        lunchDetails: existingData.lunchDetails || "",
        afternoonSnackTime: existingData.afternoonSnackTime || 0,
        afternoonSnackDetails: existingData.afternoonSnackDetails || "",
        stepName: "routine/three"
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
      stepName="routine/three"
      title="Rutina Diaria - Paso 3"
      subtitle="Por favor, completa la información sobre tu almuerzo y media tarde"
      form={form}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="lunchTime-label">Horario almuerzo</InputLabel>
            <Controller
              control={form.control}
              render={({ field }) => (
                <Select
                  labelId="lunchTime-label"
                  id="lunchTime"
                  label="Horario almuerzo"
                  displayEmpty
                  {...field}
                >
                  <MenuItem disabled value={0}>Selecciona una opción</MenuItem>
                  <MenuItem value={1}>No almuerzo</MenuItem>
                  <MenuItem value={2}>11:00 a 13:00</MenuItem>
                  <MenuItem value={3}>13:00 a 15:00</MenuItem>
                  <MenuItem value={4}>Después de las 15:00</MenuItem>
                </Select>
              )}
              name="lunchTime"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Describa su almuerzo"
            {...form.register("lunchDetails")}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="afternoonSnackTime-label">Horario de media tarde</InputLabel>
            <Controller
              control={form.control}
              render={({ field }) => (
                <Select
                  labelId="afternoonSnackTime-label"
                  id="afternoonSnackTime"
                  label="Horario de media tarde"
                  displayEmpty
                  {...field}
                >
                  <MenuItem disabled value={0}>Selecciona una opción</MenuItem>
                  <MenuItem value={1}>No como a media tarde</MenuItem>
                  <MenuItem value={2}>13:00 a 15:00</MenuItem>
                  <MenuItem value={3}>15:00 a 17:00</MenuItem>
                  <MenuItem value={4}>Después de las 17:00</MenuItem>
                </Select>
              )}
              name="afternoonSnackTime"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Describa su media tarde"
            {...form.register("afternoonSnackDetails")}
          />
        </Grid>
      </Grid>
    </RegistrationStep>
  );
};

export default RoutineThree;
