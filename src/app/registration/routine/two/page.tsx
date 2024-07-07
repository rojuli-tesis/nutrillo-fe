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

const StepName = "routine/two";

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
      breakfastTime: "",
      breakfastDetails: "",
      midMorningSnackTime: "",
      midMorningSnackDetails: "",
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
        <Typography>Rutina Diaria - Parte II</Typography>
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
                <InputLabel id="breakfastTime">Horario desayuno</InputLabel>
                <Controller
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId={"breakfastTime"}
                        fullWidth
                        displayEmpty
                        {...field}
                      >
                        <MenuItem disabled value={""}>
                          Selecciona una opcion
                        </MenuItem>
                        <MenuItem value={"none"}>No desayuno</MenuItem>
                        <MenuItem value={"4-6"}>4:00 a 6:00</MenuItem>
                        <MenuItem value={"6-8"}>6:00 a 8:00</MenuItem>
                        <MenuItem value={"8-10"}>8:00 a 10:00</MenuItem>
                        <MenuItem value={"10-12"}>10:00 a 12:00</MenuItem>
                        <MenuItem value={"12+"}>Despues de las 12:00</MenuItem>
                      </Select>
                    );
                  }}
                  name={"breakfastTime"}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={"Describa su desayuno"}
                {...register("breakfastDetails")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <InputLabel id="midMorningSnackTime">
                  Horario de media mañana
                </InputLabel>
                <Controller
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId={"midMorningSnackTime"}
                        fullWidth
                        displayEmpty
                        {...field}
                      >
                        <MenuItem disabled value={""}>
                          Selecciona una opcion
                        </MenuItem>
                        <MenuItem value={"none"}>
                          No como a media mañana
                        </MenuItem>
                        <MenuItem value={"8-10"}>8:00 a 10:00</MenuItem>
                        <MenuItem value={"10-12"}>10:00 a 12:00</MenuItem>
                        <MenuItem value={"12+"}>Despues de las 12:00</MenuItem>
                      </Select>
                    );
                  }}
                  name={"midMorningSnackTime"}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={"Describa media mañana"}
                {...register("midMorningSnackDetails")}
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
