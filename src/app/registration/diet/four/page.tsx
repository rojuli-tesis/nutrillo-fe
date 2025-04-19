"use client";

import React from "react";
import { Grid, Typography } from "@mui/material";
import { DietDetails } from "@/utils/constants/registration";
import { useForm } from "react-hook-form";
import RegistrationStep from "@/app/components/registration/RegistrationStep";
import MultiselectCheckbox from "@/app/components/forms/MultiselectCheckbox";

const DietFour = () => {
  const form = useForm<Partial<DietDetails>>({
    defaultValues: {
      dairy: [],
      stepName: "diet/four"
    },
  });

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
