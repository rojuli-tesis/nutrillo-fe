"use client";

import React, { useEffect } from "react";
import { Grid, TextField, CircularProgress, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useForm, Controller } from "react-hook-form";
import { PersonalData } from "@/utils/constants/registration";
import RegistrationStep from "@/app/components/registration/RegistrationStep";
import dayjs, { Dayjs } from "dayjs";
import { useRegistrationData } from "@/hooks/useRegistrationData";

const PersonalDataPage = () => {
  const { getStepData, isLoading } = useRegistrationData();
  const existingData = getStepData("personalData");

  const form = useForm<PersonalData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: new Date(),
      objectives: "",
      stepName: "personalData",
    },
  });

  // Update form values when existing data is loaded
  useEffect(() => {
    if (existingData) {
      form.reset({
        firstName: existingData.firstName || "",
        lastName: existingData.lastName || "",
        dob: existingData.dob ? new Date(existingData.dob) : new Date(),
        objectives: existingData.objectives || "",
        stepName: "personalData",
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
          <Controller
            name="dob"
            control={form.control}
            rules={{ required: "La fecha de nacimiento es requerida" }}
            render={({ field, fieldState }) => (
              <DatePicker
                label="Fecha de Nacimiento"
                value={field.value ? dayjs(field.value) : null}
                onChange={(newValue: Dayjs | null) => {
                  field.onChange(newValue ? newValue.toDate() : null);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message,
                  },
                }}
                openTo="year"
                views={['year', 'month', 'day']}
                maxDate={dayjs().subtract(13, "year")} // Minimum age of 13
                minDate={dayjs().subtract(120, "year")} // Maximum age of 120
              />
            )}
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
