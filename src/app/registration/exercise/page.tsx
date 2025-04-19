"use client";

import React, { useState, useEffect } from "react";
import { Grid, Slider, Button } from "@mui/material";
import { ExtraDetails, Workout } from "@/utils/constants/registration";
import { Controller, useForm } from "react-hook-form";
import RegistrationStep from "@/app/components/registration/RegistrationStep";
import WorkoutForm from "@/app/registration/exercise/components/WorkoutForm";

const emptyWorkout = {
  name: "",
  frequency: "",
  duration: "",
  startingYear: "",
  place: "",
};

const Exercise = () => {
  const [workouts, setWorkouts] = useState<Array<Workout & { id: number }>>([
    { ...emptyWorkout, id: Math.random() },
  ]);

  const form = useForm<ExtraDetails>({
    defaultValues: {
      sedentaryLevel: 0,
      workouts: [],
      stepName: "exercise"
    },
  });

  const { setValue } = form;

  useEffect(() => {
    // Update form value whenever workouts change
    setValue("workouts", workouts);
  }, [workouts, setValue]);

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
    <RegistrationStep
      stepName="exercise"
      title="Ejercitación"
      subtitle="Por favor, completa la información sobre tu actividad física"
      form={form}
    >
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sx={{
            p: "10px 50px",
          }}
        >
          <Controller
            name="sedentaryLevel"
            control={form.control}
            render={({ field }) => (
              <Slider
                step={null}
                min={0}
                max={3}
                marks={[
                  { value: 0, label: "Sedentario" },
                  { value: 1, label: "1-3 días/semana" },
                  { value: 2, label: "3-5 días/semana" },
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
          <Button variant="outlined" fullWidth onClick={addWorkout}>
            + Agregar otro ejercicio
          </Button>
        </Grid>
      </Grid>
    </RegistrationStep>
  );
};

export default Exercise;
