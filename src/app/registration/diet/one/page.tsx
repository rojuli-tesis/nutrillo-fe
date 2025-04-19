"use client";

import React from "react";
import { Grid, Typography } from "@mui/material";
import { DietDetails } from "@/utils/constants/registration";
import { useForm } from "react-hook-form";
import RegistrationStep from "@/app/components/registration/RegistrationStep";
import MultiselectCheckbox from "@/app/components/forms/MultiselectCheckbox";

const DietOne = () => {
  const form = useForm<Partial<DietDetails>>({
    defaultValues: {
      liquids: [],
      sweets: [],
      stepName: "diet/one"
    },
  });

  return (
    <RegistrationStep
      stepName="diet/one"
      title="Dieta - Paso 1"
      subtitle="Por favor, selecciona tus preferencias de líquidos y dulces"
      form={form}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography>Líquidos</Typography>
          <MultiselectCheckbox
            control={form.control}
            name="liquids"
            options={[
              { value: "water", label: "Agua" },
              { value: "coffee", label: "Café" },
              { value: 'mate', label: 'Mate'},
              { value: "tea", label: "Té" },
              { value: "juice", label: "Jugo" },
              { value: "milk", label: "Leche" },
              { value: "soda", label: "Refrescos" },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography>Dulces</Typography>
          <MultiselectCheckbox
            control={form.control}
            name="sweets"
            options={[
              { value: "chocolate", label: "Chocolate" },
              { value: "candy", label: "Caramelos" },
              { value: "cookies", label: "Galletas" },
              { value: "ice_cream", label: "Helado" },
            ]}
          />
        </Grid>
      </Grid>
    </RegistrationStep>
  );
};

export default DietOne;
