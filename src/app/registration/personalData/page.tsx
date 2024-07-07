"use client";

import React from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { usePathname, useRouter } from "next/navigation";
import {
  PersonalData as PersonalDataInterface,
  steps,
} from "@/utils/constants/registration";
import CenteredBox from "@/app/components/positioning/CenteredBox";
import { Controller, useForm } from "react-hook-form";
import restClient from "@/utils/restClient";

const StepName = "personalData";

const PersonalData = () => {
  const pathname = usePathname();
  const router = useRouter();

  const saveAndClose = async (formData: PersonalDataInterface) => {
    try {
      const res = await restClient.post(`/registration/${StepName}`, {
        data: {
          ...formData,
          stepName: StepName,
        },
        saveAndClose: true,
      });
      console.log("res", res);
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  const goToNextStep = async (formData: PersonalDataInterface) => {
    try {
      const res = await restClient.post(`/registration/${StepName}`, {
        data: {
          ...formData,
          stepName: StepName,
        },
        saveAndClose: false,
      });
      console.log("res", res);
      const currentStep = steps.indexOf(pathname.replace("/registration/", ""));
      router.push(`/registration/${steps[currentStep + 1]}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAbandon = async () => {
    await restClient.patch("/registration/abandon");
    router.push("/");
  };

  const { register, handleSubmit, control } = useForm<PersonalDataInterface>(
    {},
  );

  return (
    <div>
      <CenteredBox sx={{ flexDirection: "column" }}>
        <h2>Informacion Adicional</h2>
        <Typography>Datos Personales</Typography>
      </CenteredBox>
      <Box
        sx={{
          padding: "16px 32px",
        }}
      >
        <form onSubmit={handleSubmit(goToNextStep)}>
          <Grid container rowGap={1}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={"Nombre"}
                {...register("firstName")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={"Apellido"}
                {...register("lastName")}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name={"dob"}
                render={({ field }) => {
                  return (
                    <DatePicker
                      format={"dd/MM/yyyy"}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                        },
                      }}
                      label={"Fecha de nacimiento"}
                      onChange={(date) => field.onChange(date)}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                fullWidth
                label={"Objetivos"}
                {...register("objectives")}
              />
            </Grid>
          </Grid>
        </form>
      </Box>
      <Grid
        container
        gap={"6px"}
        sx={{
          padding: "16px 32px",
        }}
      >
        <Grid item xs={12}>
          <Button
            fullWidth
            onClick={handleSubmit(goToNextStep)}
            variant={"contained"}
          >
            Siguiente
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant={"outlined"}
            color={"secondary"}
            onClick={handleSubmit(saveAndClose)}
          >
            Guardar y Finalizar
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth color={"error"} onClick={handleAbandon}>
            Abandonar
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default PersonalData;
