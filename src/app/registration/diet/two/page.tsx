"use client";

import React from "react";
import { Grid, Typography } from "@mui/material";
import { DietDetails } from "@/utils/constants/registration";
import { useForm } from "react-hook-form";
import RegistrationStep from "@/app/components/registration/RegistrationStep";
import MultiselectCheckbox from "@/app/components/forms/MultiselectCheckbox";

const DietTwo = () => {
  const form = useForm<Partial<DietDetails>>({
    defaultValues: {
      snacks: [],
      stepName: "diet/two"
    },
  });

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
