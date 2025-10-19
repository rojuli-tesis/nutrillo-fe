"use client";

import React, { useEffect } from "react";
import { Grid, Typography, Box, CircularProgress } from "@mui/material";
import { DietDetails } from "@/utils/constants/registration";
import { useForm } from "react-hook-form";
import RegistrationStep from "@/app/components/registration/RegistrationStep";
import MultiselectCheckbox from "@/app/components/forms/MultiselectCheckbox";
import { useRegistrationData } from "@/hooks/useRegistrationData";

const DietTwo = () => {
  const { getStepData, isLoading } = useRegistrationData();
  const existingData = getStepData("diet/two");

  const form = useForm<Partial<DietDetails>>({
    defaultValues: {
      snacks: [],
      stepName: "diet/two"
    },
  });

  // Update form values when existing data is loaded
  useEffect(() => {
    if (existingData) {
      form.reset({
        snacks: existingData.snacks || [],
        stepName: "diet/two"
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
      stepName="diet/two"
      title="Dieta - Paso 2"
      subtitle="Por favor, selecciona tus preferencias de snacks"
      form={form}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography>Snacks</Typography>
          <MultiselectCheckbox
            control={form.control}
            name="snacks"
            includeOthers
            options={[
              { value: "french-fries", label: "Papas fritas" },
              { value: "popcorn", label: "Pochoclos" },
              { value: "nuts", label: "Frutos secos" },
              { value: "rice-snacks", label: "Snacks de arroz" },
              { value: "yoghurt", label: "Yoghurt" },
              { value: "fruit", label: "Fruta" },
              { value: "cereal-bars", label: "Barritas de cereal" },
              { value: "granola", label: "Granola" },
            ]}
          />
        </Grid>
      </Grid>
    </RegistrationStep>
  );
};

export default DietTwo;
