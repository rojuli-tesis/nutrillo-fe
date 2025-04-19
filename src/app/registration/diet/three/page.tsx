"use client";

import React from "react";
import { Grid, Typography } from "@mui/material";
import { DietDetails } from "@/utils/constants/registration";
import { useForm } from "react-hook-form";
import RegistrationStep from "@/app/components/registration/RegistrationStep";
import MultiselectCheckbox from "@/app/components/forms/MultiselectCheckbox";

const DietThree = () => {
  const form = useForm<Partial<DietDetails>>({
    defaultValues: {
      sweeteners: [],
      fats: [],
      stepName: "diet/three"
    },
  });

  return (
    <RegistrationStep
      stepName="diet/three"
      title="Dieta - Paso 3"
      subtitle="Por favor, selecciona tus preferencias de endulzantes y grasas"
      form={form}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography>Endulzantes</Typography>
          <MultiselectCheckbox
            control={form.control}
            name="sweeteners"
            includeOthers
            othersLabel="Edulcorante no calorico"
            othersTextPlaceholder="Nombre del endulzante"
            options={[
              { value: "white-sugar", label: "Azucar blanco" },
              { value: "honey", label: "Miel" },
              { value: "brown-sugar", label: "Azucar moreno" },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography>Para cocinar</Typography>
          <MultiselectCheckbox
            control={form.control}
            name="fats"
            includeOthers
            options={[
              { value: "butter", label: "Manteca" },
              { value: "oil", label: "Aceite" },
              { value: "margarine", label: "Margarina" },
              { value: "animal-fat", label: "Grasa animal" },
              { value: "vegetable-spray", label: "Rocio vegetal" },
              { value: "extra-virgin-olive-oil", label: "Aceite de oliva Virgen Extra" },
            ]}
          />
        </Grid>
      </Grid>
    </RegistrationStep>
  );
};

export default DietThree;
