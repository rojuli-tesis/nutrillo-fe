"use client";

import React, { useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
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
import { FormControl } from "@mui/material";
import restClient from "@/utils/restClient";
import { useRegistrationData } from "@/hooks/useRegistrationData";

const StepName = "currentStatus";

const CurrentStatus = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { getStepData, isLoading } = useRegistrationData();
  const existingData = getStepData("currentStatus");

  const { register, handleSubmit, control, reset } = useForm<PhysicalActivity>({
    defaultValues: {
      activityLevel: "",
      height: 0,
      weight: 0,
      dietType: "",
      stepName: "currentStatus",
    },
  });

  // Update form values when existing data is loaded
  useEffect(() => {
    if (existingData) {
      reset({
        activityLevel: existingData.activityLevel || "",
        height: existingData.height || 0,
        weight: existingData.weight || 0,
        dietType: existingData.dietType || "",
        stepName: "currentStatus",
      });
    }
  }, [existingData, reset]);

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

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

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
              <FormControl fullWidth>
                <InputLabel id="dietType">Tipo de dieta</InputLabel>
                <Controller
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId={"dietType"}
                        label="Tipo de dieta"
                        fullWidth
                        {...field}
                      >
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
              <FormControl fullWidth>
                <InputLabel id="activityLevel">
                  Nivel de actividad fisica
                </InputLabel>
                <Controller
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId={"activityLevel"}
                        label="Nivel de actividad fisica"
                        fullWidth
                        {...field}
                      >
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
