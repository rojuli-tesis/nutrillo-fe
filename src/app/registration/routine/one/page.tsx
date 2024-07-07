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

const StepName = "routine/one";

const RoutineOne = () => {
  const pathname = usePathname();
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { isValid },
    register,
  } = useForm<RoutineDetails>({
    defaultValues: {
      mealsADay: 0,
      householdShopper: "",
      starvingHours: "",
      preferredFoods: "",
      dislikedFoods: "",
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
        <Typography>Rutina Diaria - Parte I</Typography>
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
                <InputLabel id="mealsADay">
                  Cantidad de comidas al dia
                </InputLabel>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId={"mealsADay"}
                        fullWidth
                        displayEmpty
                        {...field}
                      >
                        <MenuItem disabled value={0}>
                          Selecciona una opcion
                        </MenuItem>
                        <MenuItem value={1}>Una</MenuItem>
                        <MenuItem value={2}>Dos</MenuItem>
                        <MenuItem value={3}>Tres</MenuItem>
                        <MenuItem value={4}>Cuatro</MenuItem>
                        <MenuItem value={5}>Mas de cuatro</MenuItem>
                      </Select>
                    );
                  }}
                  name={"mealsADay"}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <InputLabel id="householdShopper">
                  Encargado/a de hacer las compras?
                </InputLabel>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId={"householdShopper"}
                        fullWidth
                        displayEmpty
                        {...field}
                      >
                        <MenuItem disabled value="">
                          Selecciona una opcion
                        </MenuItem>
                        <MenuItem value={"patient"}>Consultante</MenuItem>
                        <MenuItem value={"partner"}>Pareja</MenuItem>
                        <MenuItem value={"family"}>Familia</MenuItem>
                        <MenuItem value={"other"}>Otro</MenuItem>
                      </Select>
                    );
                  }}
                  name={"householdShopper"}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <InputLabel id="starvingHours">
                  A que hora tiene mas hambre?
                </InputLabel>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId={"starvingHours"}
                        fullWidth
                        displayEmpty
                        {...field}
                      >
                        <MenuItem disabled value="">
                          Selecciona una opcion
                        </MenuItem>
                        <MenuItem value={"waking-up"}>Al levantarse</MenuItem>
                        <MenuItem value={"mid-morning"}>Media mañana</MenuItem>
                        <MenuItem value={"lunch"}>Almuerzo</MenuItem>
                        <MenuItem value={"mid-afternoon"}>Media tarde</MenuItem>
                        <MenuItem value={"dinner"}>Cena</MenuItem>
                        <MenuItem value={"bedtime"}>Antes de dormir</MenuItem>
                      </Select>
                    );
                  }}
                  name={"starvingHours"}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={"Alimentos preferidos"}
                {...register("preferredFoods")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={"Alimentos que no le agradan"}
                {...register("dislikedFoods")}
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

export default RoutineOne;
