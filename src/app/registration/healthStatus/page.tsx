"use client";

import React, { useEffect } from "react";
import {
  Grid,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Box,
  CircularProgress,
} from "@mui/material";
import { HealthStatus as HealthStatusInterface } from "@/utils/constants/registration";
import { Controller, useForm } from "react-hook-form";
import RegistrationStep from "@/app/components/registration/RegistrationStep";
import { useRegistrationData } from "@/hooks/useRegistrationData";

const HealthStatus = () => {
  const { getStepData, isLoading } = useRegistrationData();
  const existingData = getStepData("healthStatus");

  const form = useForm<HealthStatusInterface>({
    defaultValues: {
      diagnosedIllness: 0,
      medication: 0,
      weightLossMeds: 0,
      stepName: "healthStatus"
    },
  });

  // Update form values when existing data is loaded
  useEffect(() => {
    if (existingData) {
      form.reset({
        diagnosedIllness: existingData.diagnosedIllness || 0,
        medication: existingData.medication || 0,
        weightLossMeds: existingData.weightLossMeds || 0,
        stepName: "healthStatus"
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
      stepName="healthStatus"
      title="Estado de Salud"
      subtitle="Por favor, completa la información sobre tu estado de salud"
      form={form}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="diagnosedIllness-label">Enfermedades diagnosticadas</InputLabel>
            <Controller
              control={form.control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  labelId="diagnosedIllness-label"
                  id="diagnosedIllness"
                  label="Enfermedades diagnosticadas"
                  displayEmpty
                  {...field}
                >
                  <MenuItem disabled value={0}>Selecciona una opción</MenuItem>
                  <MenuItem value={1}>Ninguna</MenuItem>
                  <MenuItem value={2}>Diabetes</MenuItem>
                  <MenuItem value={3}>Hepatitis</MenuItem>
                  <MenuItem value={4}>Colesterol alto</MenuItem>
                  <MenuItem value={5}>Presión arterial alta</MenuItem>
                  <MenuItem value={6}>Síndrome de colon irritable</MenuItem>
                  <MenuItem value={7}>Enfermedad renal</MenuItem>
                  <MenuItem value={8}>Tiroides (hiper/hipotiroidismo)</MenuItem>
                  <MenuItem value={9}>TDA</MenuItem>
                  <MenuItem value={10}>Otra</MenuItem>
                </Select>
              )}
              name="diagnosedIllness"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="medication-label">¿Toma medicamentos?</InputLabel>
            <Controller
              control={form.control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  labelId="medication-label"
                  id="medication"
                  label="¿Toma medicamentos?"
                  displayEmpty
                  {...field}
                >
                  <MenuItem disabled value={0}>Selecciona una opción</MenuItem>
                  <MenuItem value={1}>Ninguno</MenuItem>
                  <MenuItem value={2}>Diabetes</MenuItem>
                  <MenuItem value={3}>Anticonceptivos</MenuItem>
                  <MenuItem value={4}>Antidepresivos</MenuItem>
                  <MenuItem value={5}>Otros</MenuItem>
                </Select>
              )}
              name="medication"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="weightLossMeds-label">¿Tomas medicamentos para bajar de peso?</InputLabel>
            <Controller
              control={form.control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  labelId="weightLossMeds-label"
                  id="weightLossMeds"
                  label="¿Tomas medicamentos para bajar de peso?"
                  displayEmpty
                  {...field}
                >
                  <MenuItem disabled value={0}>Selecciona una opción</MenuItem>
                  <MenuItem value={1}>Ninguno</MenuItem>
                  <MenuItem value={2}>Recetados</MenuItem>
                  <MenuItem value={3}>Sin receta</MenuItem>
                </Select>
              )}
              name="weightLossMeds"
            />
          </FormControl>
        </Grid>
      </Grid>
    </RegistrationStep>
  );
};

export default HealthStatus;
