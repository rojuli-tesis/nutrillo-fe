"use client";

import React from "react";
import {
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormControl,
} from "@mui/material";
import { RoutineDetails } from "@/utils/constants/registration";
import { Controller, useForm } from "react-hook-form";
import RegistrationStep from "@/app/components/registration/RegistrationStep";

const RoutineTwo = () => {
  const form = useForm<RoutineDetails>({
    defaultValues: {
      breakfastTime: 0,
      breakfastDetails: "",
      midMorningSnackTime: 0,
      midMorningSnackDetails: "",
      stepName: "routine/two"
    },
  });

  return (
    <RegistrationStep
      stepName="routine/two"
      title="Rutina Diaria - Paso 2"
      subtitle="Por favor, completa la información sobre tu desayuno y media mañana"
      form={form}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="breakfastTime-label">Horario desayuno</InputLabel>
            <Controller
              control={form.control}
              render={({ field }) => (
                <Select
                  labelId="breakfastTime-label"
                  id="breakfastTime"
                  label="Horario desayuno"
                  displayEmpty
                  {...field}
                >
                  <MenuItem disabled value={0}>Selecciona una opción</MenuItem>
                  <MenuItem value={1}>No desayuno</MenuItem>
                  <MenuItem value={2}>4:00 a 6:00</MenuItem>
                  <MenuItem value={3}>6:00 a 8:00</MenuItem>
                  <MenuItem value={4}>8:00 a 10:00</MenuItem>
                  <MenuItem value={5}>10:00 a 12:00</MenuItem>
                  <MenuItem value={6}>Después de las 12:00</MenuItem>
                </Select>
              )}
              name="breakfastTime"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Describa su desayuno"
            {...form.register("breakfastDetails")}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="midMorningSnackTime-label">Horario de media mañana</InputLabel>
            <Controller
              control={form.control}
              render={({ field }) => (
                <Select
                  labelId="midMorningSnackTime-label"
                  id="midMorningSnackTime"
                  label="Horario de media mañana"
                  displayEmpty
                  {...field}
                >
                  <MenuItem disabled value={0}>Selecciona una opción</MenuItem>
                  <MenuItem value={1}>No como a media mañana</MenuItem>
                  <MenuItem value={2}>8:00 a 10:00</MenuItem>
                  <MenuItem value={3}>10:00 a 12:00</MenuItem>
                  <MenuItem value={4}>Después de las 12:00</MenuItem>
                </Select>
              )}
              name="midMorningSnackTime"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Describa media mañana"
            {...form.register("midMorningSnackDetails")}
          />
        </Grid>
      </Grid>
    </RegistrationStep>
  );
};

export default RoutineTwo;
