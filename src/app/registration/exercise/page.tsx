"use client";

import React, { useState } from "react";
import { Box, Typography, Grid, Slider, Button } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { ExtraDetails, steps, Workout } from "@/utils/constants/registration";
import CenteredBox from "@/app/components/positioning/CenteredBox";
import restClient from "@/utils/restClient";
import { Controller, useForm } from "react-hook-form";
import WorkoutForm from "@/app/registration/exercise/components/WorkoutForm";

const StepName = "exercise";

const emptyWorkout = {
  name: "",
  frequency: "",
  duration: "",
  startingYear: "",
  place: "",
};

const AdditionalInfo = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Array<Workout & { id: number }>>([
    { ...emptyWorkout, id: Math.random() },
  ]);
  const { handleSubmit, setValue, control } = useForm<ExtraDetails>({
    defaultValues: {
      sedentaryLevel: 0,
      workouts: [],
    },
  });

  const getClearDataForSubmit = (formData: Partial<ExtraDetails>) => ({
    sedentaryLevel: formData.sedentaryLevel,
    workouts: (
      (formData.workouts || []) as Array<Workout & { id: number }>
    ).map(({ id, ...wk }) => wk) as Workout[],
  });

  const goToNextStep = async (formData: Partial<ExtraDetails>) => {
    const clearData = getClearDataForSubmit(formData);
    try {
      await restClient.post(`/registration/${StepName.replace("/", "-")}`, {
        data: {
          ...clearData,
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
  const saveAndClose = async (formData: Partial<ExtraDetails>) => {
    const clearData = getClearDataForSubmit(formData);
    try {
      await restClient.post(`/registration/${StepName.replace("/", "-")}`, {
        data: {
          ...clearData,
          stepName: StepName,
        },
        saveAndClose: true,
      });
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

  const addWorkout = () => {
    setWorkouts([...workouts, { ...emptyWorkout, id: Math.random() }]);
  };

  const removeWorkout = (idx: number) => {
    const cleanList = workouts.filter((_, i) => i !== idx);
    setWorkouts(cleanList);
    setValue("workouts", cleanList);
  };

  const handleFieldChange =
    (fieldName: keyof Workout, idx: number) =>
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setWorkouts((prev) => {
        const newWorkouts = [...prev];
        newWorkouts[idx][fieldName] = evt.target.value;
        // Set value in react-hook-form
        setValue("workouts", newWorkouts);
        return newWorkouts;
      });
    };

  return (
    <div>
      <CenteredBox sx={{ flexDirection: "column" }}>
        <h2>Informacion Adicional</h2>
        <Typography>Ejercitacion</Typography>
      </CenteredBox>{" "}
      <Box
        sx={{
          padding: "16px 32px",
        }}
      >
        <form onSubmit={handleSubmit(goToNextStep)}>
          <Grid container rowGap={1}>
            <Grid
              item
              xs={12}
              sx={{
                p: "10px 50px",
              }}
            >
              <Controller
                name="sedentaryLevel"
                control={control}
                render={({ field }) => (
                  <Slider
                    step={null}
                    min={0}
                    max={3}
                    marks={[
                      { value: 0, label: "Sedentario" },
                      { value: 1, label: "1-3 dias/semana" },
                      { value: 2, label: "3-5 dias/semana" },
                      { value: 3, label: "Alta intensidad" },
                    ]}
                    value={typeof field.value === "number" ? field.value : 0}
                    onChange={(_, value) => field.onChange(value)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              {workouts.map((wk, idx) => (
                <WorkoutForm
                  index={idx}
                  onFieldChange={handleFieldChange}
                  onRemove={() => removeWorkout(idx)}
                  key={wk.id}
                />
              ))}
              <Button variant={"outlined"} fullWidth onClick={addWorkout}>
                + Agregar otro ejercicio
              </Button>
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

export default AdditionalInfo;
