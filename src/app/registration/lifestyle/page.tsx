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
import { ExtraDetails } from "@/utils/constants/registration";
import { Controller, useForm } from "react-hook-form";
import RegistrationStep from "@/app/components/registration/RegistrationStep";
import { useRegistrationData } from "@/hooks/useRegistrationData";

const Lifestyle = () => {
  const { getStepData, isLoading } = useRegistrationData();
  const existingData = getStepData("lifestyle");

  const form = useForm<ExtraDetails>({
    defaultValues: {
      alcohol: 0,
      alcoholDetails: "",
      smoking: 0,
      smokingDetails: "",
      supplements: 0,
      supplementsDetails: "",
      sedentaryLevel: '',
      workouts: [],
      stepName: "lifestyle"
    },
  });

  // Update form values when existing data is loaded
  useEffect(() => {
    if (existingData) {
      form.reset({
        alcohol: existingData.alcohol || 0,
        alcoholDetails: existingData.alcoholDetails || "",
        smoking: existingData.smoking || 0,
        smokingDetails: existingData.smokingDetails || "",
        supplements: existingData.supplements || 0,
        supplementsDetails: existingData.supplementsDetails || "",
        sedentaryLevel: existingData.sedentaryLevel || '',
        workouts: existingData.workouts || [],
        stepName: "lifestyle"
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
      stepName="lifestyle"
      title="Estilo de Vida"
      subtitle="Por favor, completa la información sobre tus hábitos"
      form={form}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="alcohol-label">¿Bebe alcohol?</InputLabel>
            <Controller
              control={form.control}
              render={({ field }) => (
                <Select
                  labelId="alcohol-label"
                  id="alcohol"
                  label="¿Bebe alcohol?"
                  displayEmpty
                  {...field}
                >
                  <MenuItem disabled value={0}>Selecciona una opción</MenuItem>
                  <MenuItem value={1}>No</MenuItem>
                  <MenuItem value={2}>Raramente</MenuItem>
                  <MenuItem value={3}>Socialmente</MenuItem>
                  <MenuItem value={4}>Frecuentemente</MenuItem>
                </Select>
              )}
              name="alcohol"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Detalles sobre consumo de alcohol"
            placeholder="Describa frecuencia y cantidad"
            {...form.register("alcoholDetails")}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="smoking-label">¿Fuma?</InputLabel>
            <Controller
              control={form.control}
              render={({ field }) => (
                <Select
                  labelId="smoking-label"
                  id="smoking"
                  label="¿Fuma?"
                  displayEmpty
                  {...field}
                >
                  <MenuItem disabled value={0}>Selecciona una opción</MenuItem>
                  <MenuItem value={1}>No</MenuItem>
                  <MenuItem value={2}>Raramente</MenuItem>
                  <MenuItem value={3}>Socialmente</MenuItem>
                  <MenuItem value={4}>Frecuentemente</MenuItem>
                </Select>
              )}
              name="smoking"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Hábitos de fumador"
            placeholder="Describa frecuencia y cantidad"
            {...form.register("smokingDetails")}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="supplements-label">¿Utiliza suplementos dietarios?</InputLabel>
            <Controller
              control={form.control}
              render={({ field }) => (
                <Select
                  labelId="supplements-label"
                  id="supplements"
                  label="¿Utiliza suplementos dietarios?"
                  displayEmpty
                  {...field}
                >
                  <MenuItem disabled value={0}>Selecciona una opción</MenuItem>
                  <MenuItem value={1}>No</MenuItem>
                  <MenuItem value={2}>Raramente</MenuItem>
                  <MenuItem value={3}>Frecuentemente</MenuItem>
                </Select>
              )}
              name="supplements"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Descripción de suplementos"
            placeholder="Indique cuáles suplementos, momento de ingesta, etc."
            {...form.register("supplementsDetails")}
          />
        </Grid>
      </Grid>
    </RegistrationStep>
  );
};

export default Lifestyle;
