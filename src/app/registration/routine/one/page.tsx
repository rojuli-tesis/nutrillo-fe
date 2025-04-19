"use client";

import React from "react";
import {
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
} from "@mui/material";
import { RoutineDetails } from "@/utils/constants/registration";
import { Controller, useForm } from "react-hook-form";
import RegistrationStep from "@/app/components/registration/RegistrationStep";

const RoutineOne = () => {
  const form = useForm<RoutineDetails>({
    defaultValues: {
      mealsADay: 0,
      householdShopper: 0,
      starvingHours: 0,
      preferredFoods: "",
      dislikedFoods: "",
      stepName: "routine/one"
    },
  });

  return (
    <RegistrationStep
      stepName="routine/one"
      title="Rutina Diaria - Paso 1"
      subtitle="Por favor, completa la información sobre tus hábitos alimenticios"
      form={form}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="mealsADay-label">Cantidad de comidas al día</InputLabel>
            <Controller
              control={form.control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  labelId="mealsADay-label"
                  id="mealsADay"
                  label="Cantidad de comidas al día"
                  displayEmpty
                  {...field}
                >
                  <MenuItem disabled value={0}>Selecciona una opción</MenuItem>
                  <MenuItem value={1}>Una</MenuItem>
                  <MenuItem value={2}>Dos</MenuItem>
                  <MenuItem value={3}>Tres</MenuItem>
                  <MenuItem value={4}>Cuatro</MenuItem>
                  <MenuItem value={5}>Más de cuatro</MenuItem>
                </Select>
              )}
              name="mealsADay"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="householdShopper-label">¿Encargado/a de hacer las compras?</InputLabel>
            <Controller
              control={form.control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  labelId="householdShopper-label"
                  id="householdShopper"
                  label="¿Encargado/a de hacer las compras?"
                  displayEmpty
                  {...field}
                >
                  <MenuItem disabled value={0}>Selecciona una opción</MenuItem>
                  <MenuItem value={1}>Consultante</MenuItem>
                  <MenuItem value={2}>Pareja</MenuItem>
                  <MenuItem value={3}>Familia</MenuItem>
                  <MenuItem value={4}>Otro</MenuItem>
                </Select>
              )}
              name="householdShopper"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="starvingHours-label">¿A qué hora tiene más hambre?</InputLabel>
            <Controller
              control={form.control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  labelId="starvingHours-label"
                  id="starvingHours"
                  label="¿A qué hora tiene más hambre?"
                  displayEmpty
                  {...field}
                >
                  <MenuItem disabled value={0}>Selecciona una opción</MenuItem>
                  <MenuItem value={1}>Al levantarse</MenuItem>
                  <MenuItem value={2}>Media mañana</MenuItem>
                  <MenuItem value={3}>Almuerzo</MenuItem>
                  <MenuItem value={4}>Media tarde</MenuItem>
                  <MenuItem value={5}>Cena</MenuItem>
                  <MenuItem value={6}>Antes de dormir</MenuItem>
                </Select>
              )}
              name="starvingHours"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Alimentos preferidos"
            {...form.register("preferredFoods")}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Alimentos que no le agradan"
            {...form.register("dislikedFoods")}
          />
        </Grid>
      </Grid>
    </RegistrationStep>
  );
};

export default RoutineOne;
