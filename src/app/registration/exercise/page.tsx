"use client";

import React, { useState, useEffect } from "react";
import { Grid, Button, Box, CircularProgress } from "@mui/material";
import { ExtraDetails, Workout } from "@/utils/constants/registration";
import { Controller, useForm } from "react-hook-form";
import RegistrationStep from "@/app/components/registration/RegistrationStep";
import WorkoutForm from "@/app/registration/exercise/components/WorkoutForm";
import ActivityLevelField from "@/components/form/ActivityLevelField";
import { useRegistrationData } from "@/hooks/useRegistrationData";

const emptyWorkout = {
  name: "",
  frequency: "",
  duration: "",
  startingYear: "",
  place: "",
};

const Exercise = () => {
  const { getStepData, isLoading } = useRegistrationData();
  const existingData = getStepData("exercise");

  const [workouts, setWorkouts] = useState<Array<Workout & { id: number }>>([
    { ...emptyWorkout, id: Math.random() },
  ]);

  const form = useForm<ExtraDetails>({
    defaultValues: {
      sedentaryLevel: '',
      workouts: [],
      stepName: "exercise"
    },
  });

  const { setValue, reset } = form;

  useEffect(() => {
    // Update form value whenever workouts change
    setValue("workouts", workouts);
  }, [workouts, setValue]);

  // Update form values when existing data is loaded
  useEffect(() => {
    if (existingData) {
      const existingWorkouts = existingData.workouts || [];
      const workoutsWithIds = existingWorkouts.length > 0 
        ? existingWorkouts.map((workout: Workout, index: number) => ({ ...workout, id: Math.random() }))
        : [{ ...emptyWorkout, id: Math.random() }];
      
      setWorkouts(workoutsWithIds);
      
      reset({
        sedentaryLevel: existingData.sedentaryLevel || '',
        workouts: existingWorkouts,
        stepName: "exercise"
      });
    }
  }, [existingData, reset]);

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

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <RegistrationStep
      stepName="exercise"
      title="Ejercitación"
      subtitle="Por favor, completa la información sobre tu actividad física"
      form={form}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="sedentaryLevel"
            control={form.control}
            render={({ field }) => (
              <ActivityLevelField
                name="sedentaryLevel"
                value={field.value}
                onChange={field.onChange}
                required
                helperText="Selecciona el nivel que mejor describa tu actividad física actual"
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
          <Button variant="outlined" fullWidth onClick={addWorkout}>
            + Agregar otro ejercicio
          </Button>
        </Grid>
      </Grid>
    </RegistrationStep>
  );
};

export default Exercise;
