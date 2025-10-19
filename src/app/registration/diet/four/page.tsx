"use client";

import React, { useEffect } from "react";
import { Grid, Typography, Box, CircularProgress } from "@mui/material";
import { DietDetails } from "@/utils/constants/registration";
import { useForm } from "react-hook-form";
import RegistrationStep from "@/app/components/registration/RegistrationStep";
import MultiselectCheckbox from "@/app/components/forms/MultiselectCheckbox";
import { useRegistrationData } from "@/hooks/useRegistrationData";

const DietFour = () => {
  const { getStepData, isLoading } = useRegistrationData();
  const existingData = getStepData("diet/four");

  const form = useForm<Partial<DietDetails>>({
    defaultValues: {
      dairy: [],
      stepName: "diet/four"
    },
  });

  // Update form values when existing data is loaded
  useEffect(() => {
    if (existingData) {
      form.reset({
        dairy: existingData.dairy || [],
        stepName: "diet/four"
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
      stepName="diet/four"
      title="Dieta - Paso 4"
      subtitle="Por favor, selecciona tus preferencias de lácteos"
      form={form}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography>Lácteos</Typography>
          <MultiselectCheckbox
            control={form.control}
            name="dairy"
            includeOthers
            othersLabel="Quesos"
            othersTextPlaceholder="Listado de quesos: "
            options={[
              { value: "whole", label: "Enteros" },
              { value: "skimmed", label: "Descremados" },
              { value: "creams", label: "Cremas" },
              { value: "mayonnaise", label: "Mayonesas o aderezos" },
            ]}
          />
        </Grid>
      </Grid>
    </RegistrationStep>
  );
};

export default DietFour;
