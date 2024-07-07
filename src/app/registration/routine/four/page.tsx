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
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { RoutineDetails, steps } from "@/utils/constants/registration";
import CenteredBox from "@/app/components/positioning/CenteredBox";
import { Controller, useForm } from "react-hook-form";
import { FormControl } from "@mui/base";
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
      meriendaTime: "",
      meriendaDetails: "",
      dinnerTime: "",
      dinnerDetails: "",
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
              <FormControl>
                <InputLabel id="meriendaTime">Horario merienda</InputLabel>
                <Controller
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId={"meriendaTime"}
                        fullWidth
                        displayEmpty
                        {...field}
                      >
                        <MenuItem disabled value={""}>
                          Selecciona una opcion
                        </MenuItem>
                        <MenuItem value={"none"}>No meriendo</MenuItem>
                        <MenuItem value={"15-17"}>15:00 a 17:00</MenuItem>
                        <MenuItem value="17-19">17:00 a 19:00</MenuItem>
                        <MenuItem value={"19+"}>Despues de las 19:00</MenuItem>
                      </Select>
                    );
                  }}
                  name={"meriendaTime"}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={"Describa su merienda"}
                {...register("meriendaDetails")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <InputLabel id="dinnerTime">Horario de cena</InputLabel>
                <Controller
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId={"dinnerTime"}
                        fullWidth
                        displayEmpty
                        {...field}
                      >
                        <MenuItem disabled value={""}>
                          Selecciona una opcion
                        </MenuItem>
                        <MenuItem value={"none"}>No ceno</MenuItem>
                        <MenuItem value="19-21">19:00 a 21:00</MenuItem>
                        <MenuItem value={"21-23"}>21:00 a 23:00</MenuItem>
                        <MenuItem value={"23+"}>Despues de las 23:00</MenuItem>
                      </Select>
                    );
                  }}
                  name={"dinnerTime"}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={"Describa su cena"}
                {...register("dinnerDetails")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <InputLabel id="sleepTime">
                  A que hora se acuesta a dormir?
                </InputLabel>
                <Controller
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId={"sleepTime"}
                        fullWidth
                        displayEmpty
                        {...field}
                      >
                        <MenuItem disabled value={""}>
                          Selecciona una opcion
                        </MenuItem>
                        <MenuItem value="19-21">19:00 a 21:00</MenuItem>
                        <MenuItem value={"21-23"}>21:00 a 23:00</MenuItem>
                        <MenuItem value={"23-01"}>23:00 a 01:00</MenuItem>
                        <MenuItem value={"+01"}>Despues de 01:00</MenuItem>
                      </Select>
                    );
                  }}
                  name={"sleepTime"}
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
