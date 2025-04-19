"use client";

import React from "react";
import {
  Box,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { RoutineDetails, steps } from "@/utils/constants/registration";
import CenteredBox from "@/app/components/positioning/CenteredBox";
import { Controller, useForm } from "react-hook-form";
import restClient from "@/utils/restClient";
import { HealthStatus as HealthStatusInterface } from "@/utils/constants/registration";

const StepName = "routine/four";

const RoutineTwo = () => {
  const pathname = usePathname();
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { isValid },
    register,
  } = useForm<RoutineDetails>({
    defaultValues: {
      meriendaTime: 0,
      meriendaDetails: "",
      dinnerTime: 0,
      dinnerDetails: "",
      sleepTime: 0,
      stepName: StepName,
    },
  });

  const handleAbandon = async () => {
    await restClient.patch("/registration/abandon");
    router.push("/");
  };

  const saveAndClose = async (formData: Partial<RoutineDetails>) => {
    try {
      await restClient.post(`/registration/${StepName.replace("/", "-")}`, {
        data: {
          ...formData,
          stepName: StepName,
        },
        saveAndClose: true,
      });
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  const goToNextStep = async (formData: Partial<RoutineDetails>) => {
    try {
      await restClient.post(`/registration/${StepName.replace("/", "-")}`, {
        data: {
          ...formData,
          stepName: StepName,
        },
        saveAndClose: false,
      });
      const currentStep = steps.indexOf(pathname.replace("/registration/", ""));
      router.push(`/registration/${steps[currentStep + 1]}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <CenteredBox sx={{ flexDirection: "column" }}>
        <h2>Informacion Adicional</h2>
        <Typography>Rutina Diaria - Parte IV</Typography>
      </CenteredBox>
      <Box
        sx={{
          padding: "16px 32px",
        }}
      >
        <form onSubmit={handleSubmit(goToNextStep)}>
          <Grid container rowGap={1}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="meriendaTime-label">Horario merienda</InputLabel>
                <Controller
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId="meriendaTime-label"
                        id="meriendaTime"
                        label="Horario merienda"
                        fullWidth
                        displayEmpty
                        {...field}
                      >
                        <MenuItem disabled value={0}>Selecciona una opción</MenuItem>
                        <MenuItem value={1}>No meriendo</MenuItem>
                        <MenuItem value={2}>15:00 a 17:00</MenuItem>
                        <MenuItem value={3}>17:00 a 19:00</MenuItem>
                        <MenuItem value={4}>Después de las 19:00</MenuItem>
                      </Select>
                    );
                  }}
                  name="meriendaTime"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Describa su merienda"
                {...register("meriendaDetails")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="dinnerTime-label">Horario de cena</InputLabel>
                <Controller
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId="dinnerTime-label"
                        id="dinnerTime"
                        label="Horario de cena"
                        fullWidth
                        displayEmpty
                        {...field}
                      >
                        <MenuItem disabled value={0}>Selecciona una opción</MenuItem>
                        <MenuItem value={1}>No ceno</MenuItem>
                        <MenuItem value={2}>19:00 a 21:00</MenuItem>
                        <MenuItem value={3}>21:00 a 23:00</MenuItem>
                        <MenuItem value={4}>Después de las 23:00</MenuItem>
                      </Select>
                    );
                  }}
                  name="dinnerTime"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Describa su cena"
                {...register("dinnerDetails")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="sleepTime-label">¿A qué hora se acuesta a dormir?</InputLabel>
                <Controller
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId="sleepTime-label"
                        id="sleepTime"
                        label="¿A qué hora se acuesta a dormir?"
                        fullWidth
                        displayEmpty
                        {...field}
                      >
                        <MenuItem disabled value={0}>Selecciona una opción</MenuItem>
                        <MenuItem value={1}>19:00 a 21:00</MenuItem>
                        <MenuItem value={2}>21:00 a 23:00</MenuItem>
                        <MenuItem value={3}>23:00 a 01:00</MenuItem>
                        <MenuItem value={4}>Después de 01:00</MenuItem>
                      </Select>
                    );
                  }}
                  name="sleepTime"
                />
              </FormControl>
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
            disabled={!isValid}
          >
            Siguiente
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            onClick={handleSubmit(saveAndClose)}
            variant={"outlined"}
            color={"secondary"}
            disabled={!isValid}
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

export default RoutineTwo;
