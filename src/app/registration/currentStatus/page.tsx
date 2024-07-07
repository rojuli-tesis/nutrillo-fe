"use client";

import React from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { PhysicalActivity, steps } from "@/utils/constants/registration";
import CenteredBox from "@/app/components/positioning/CenteredBox";
import { Controller, useForm } from "react-hook-form";
import { FormControl } from "@mui/base";
import restClient from "@/utils/restClient";

const StepName = "currentStatus";

const CurrentStatus = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { register, handleSubmit, control } = useForm<PhysicalActivity>({
    defaultValues: {
      activityLevel: "",
      dietType: "",
    },
  });

  const handleAbandon = async () => {
    await restClient.patch("/registration/abandon");
    router.push("/");
  };

  const saveAndClose = async (formData: PhysicalActivity) => {
    try {
      await restClient.post(`/registration/${StepName}`, {
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

  const goToNextStep = async (formData: PhysicalActivity) => {
    try {
      const res = await restClient.post(`/registration/${StepName}`, {
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
        <Typography>Estado Actual</Typography>
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
                label={"Altura"}
                type="number"
                InputProps={{
                  endAdornment: "cm",
                }}
                {...register("height")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={"Peso"}
                type="number"
                InputProps={{
                  endAdornment: "kg",
                }}
                {...register("weight")}
              />
            </Grid>
            <Grid item xs={12} sx={{ margin: "10px 0" }}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <InputLabel id="dietType">Tipo de dieta</InputLabel>
                <Controller
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId={"dietType"}
                        fullWidth
                        displayEmpty
                        {...field}
                      >
                        <MenuItem disabled value="">
                          Selecciona una opcion
                        </MenuItem>
                        <MenuItem value="vegetarian">Vegetarianismo</MenuItem>
                        <MenuItem value="vegan">Veganismo</MenuItem>
                        <MenuItem value="celiac">Celiaquia</MenuItem>
                        <MenuItem value="pescetarian">Pescetarianismo</MenuItem>
                        <MenuItem value="omnivore">Omnivoro</MenuItem>
                      </Select>
                    );
                  }}
                  name={"dietType"}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <InputLabel id="activityLevel">
                  Nivel de actividad fisica
                </InputLabel>
                <Controller
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId={"activityLevel"}
                        fullWidth
                        displayEmpty
                        {...field}
                      >
                        <MenuItem disabled value="">
                          Selecciona una opcion
                        </MenuItem>
                        <MenuItem value="high">Alta intensidad</MenuItem>
                        <MenuItem value="mid">Media intensidad</MenuItem>
                        <MenuItem value="low">Baja intensidad</MenuItem>
                        <MenuItem value="none">Sedentarismo</MenuItem>
                      </Select>
                    );
                  }}
                  name={"activityLevel"}
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

export default CurrentStatus;
