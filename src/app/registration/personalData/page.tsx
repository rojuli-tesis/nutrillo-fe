"use client";

import React from "react";
import { Grid, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { PersonalData } from "@/utils/constants/registration";
import RegistrationStep from "@/app/components/registration/RegistrationStep";

const PersonalDataPage = () => {
  const form = useForm<PersonalData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: new Date(),
      objectives: "",
      stepName: "personalData",
    },
  });

  return (
    <RegistrationStep
      stepName="personalData"
      title="Datos Personales"
      subtitle="Por favor, ingresa tus datos personales"
      form={form}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nombre"
            {...form.register("firstName", { required: true })}
            error={!!form.formState.errors.firstName}
            helperText={form.formState.errors.firstName?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Apellido"
            {...form.register("lastName", { required: true })}
            error={!!form.formState.errors.lastName}
            helperText={form.formState.errors.lastName?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Fecha de Nacimiento"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...form.register("dob", { required: true })}
            error={!!form.formState.errors.dob}
            helperText={form.formState.errors.dob?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Objetivos"
            multiline
            rows={4}
            {...form.register("objectives", { required: true })}
            error={!!form.formState.errors.objectives}
            helperText={form.formState.errors.objectives?.message}
          />
        </Grid>
      </Grid>
    </RegistrationStep>
  );
};

export default PersonalDataPage;
