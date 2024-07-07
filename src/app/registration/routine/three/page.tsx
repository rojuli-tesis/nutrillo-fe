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

const StepName = "routine/three";

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
      lunchTime: "",
      lunchDetails: "",
      afternoonSnackTime: "",
      afternoonSnackDetails: "",
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
        <Typography>Rutina Diaria - Parte III</Typography>
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
                <InputLabel id="lunchTime">Horario almuerzo</InputLabel>
                <Controller
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId={"lunchTime"}
                        fullWidth
                        displayEmpty
                        {...field}
                      >
                        <MenuItem disabled value={""}>
                          Selecciona una opcion
                        </MenuItem>
                        <MenuItem value={"none"}>No almuerzo</MenuItem>
                        <MenuItem value={"11-13"}>11:00 a 13:00</MenuItem>
                        <MenuItem value={"13-15"}>13:00 a 15:00</MenuItem>
                        <MenuItem value={"15+"}>Despues de las 15:00</MenuItem>
                      </Select>
                    );
                  }}
                  name={"lunchTime"}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={"Describa su almuerzo"}
                {...register("lunchDetails")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <InputLabel id="afternoonSnackTime">
                  Horario de media tarde
                </InputLabel>
                <Controller
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId={"afternoonSnackTime"}
                        fullWidth
                        displayEmpty
                        {...field}
                      >
                        <MenuItem disabled value={""}>
                          Selecciona una opcion
                        </MenuItem>
                        <MenuItem value={"none"}>
                          No como a media tarde
                        </MenuItem>
                        <MenuItem value="13-15">13:00 a 15:00</MenuItem>
                        <MenuItem value="15-17">15:00 a 17:00</MenuItem>
                        <MenuItem value="17+">Despues de las 17:00</MenuItem>
                      </Select>
                    );
                  }}
                  name={"afternoonSnackTime"}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={"Describa su media tarde"}
                {...register("afternoonSnackDetails")}
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
