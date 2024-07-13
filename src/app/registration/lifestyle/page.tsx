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
import {
  ExtraDetails,
  RoutineDetails,
  steps,
} from "@/utils/constants/registration";
import CenteredBox from "@/app/components/positioning/CenteredBox";
import { Controller, useForm } from "react-hook-form";
import restClient from "@/utils/restClient";
import { FormControl } from "@mui/base";

const StepName = "lifestyle";

const Lifestyle = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { handleSubmit, control, register } = useForm<Partial<ExtraDetails>>({
    defaultValues: {
      alcohol: "",
      alcoholDetails: "",
      smoking: "",
      smokingDetails: "",
      supplements: "",
      supplementsDetails: "",
    },
  });

  const saveAndClose = async (formData: Partial<ExtraDetails>) => {
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

  const handleAbandon = async () => {
    await restClient.patch("/registration/abandon");
    router.push("/");
  };

  return (
    <div>
      <CenteredBox sx={{ flexDirection: "column" }}>
        <h2>Informacion Adicional</h2>
        <Typography>Estilo de Vida</Typography>
      </CenteredBox>
      <Box
        sx={{
          padding: "16px 32px",
        }}
      >
        <form onSubmit={handleSubmit(saveAndClose)}>
          <Grid container rowGap={1}>
            <Grid item xs={12}>
              <FormControl>
                <InputLabel id="alcohol">Bebe alcohol?</InputLabel>
                <Controller
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId={"alcohol"}
                        fullWidth
                        displayEmpty
                        {...field}
                      >
                        <MenuItem disabled value={""}>
                          Selecciona una opcion
                        </MenuItem>
                        <MenuItem value={"no"}>No</MenuItem>
                        <MenuItem value={"rarely"}>Raramente</MenuItem>
                        <MenuItem value={"social"}>Socialmente</MenuItem>
                        <MenuItem value={"frecuently"}>Frecuentemente</MenuItem>
                      </Select>
                    );
                  }}
                  name={"alcohol"}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={"Detalles sobre consumo de alcohol"}
                placeholder={"Describa frecuencia y cantidad"}
                {...register("alcoholDetails")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <InputLabel id="smoking">Fuma?</InputLabel>
                <Controller
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId={"smoking"}
                        fullWidth
                        displayEmpty
                        {...field}
                      >
                        <MenuItem disabled value={""}>
                          Selecciona una opcion
                        </MenuItem>
                        <MenuItem value={"no"}>No</MenuItem>
                        <MenuItem value={"rarely"}>Raramente</MenuItem>
                        <MenuItem value={"social"}>Socialmente</MenuItem>
                        <MenuItem value={"frecuently"}>Frecuentemente</MenuItem>
                      </Select>
                    );
                  }}
                  name={"smoking"}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={"Habitos de fumador"}
                placeholder={"Describa frecuencia y cantidad"}
                {...register("smokingDetails")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <InputLabel id="supplements">
                  Utiliza suplementos dietarios?
                </InputLabel>
                <Controller
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId={"supplements"}
                        fullWidth
                        displayEmpty
                        {...field}
                      >
                        <MenuItem disabled value={""}>
                          Selecciona una opcion
                        </MenuItem>
                        <MenuItem value={"no"}>No</MenuItem>
                        <MenuItem value={"rarely"}>Raramente</MenuItem>
                        <MenuItem value={"frecuently"}>Frecuentemente</MenuItem>
                      </Select>
                    );
                  }}
                  name={"supplements"}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={"Descripcion de suplementos"}
                placeholder={
                  "Indique cuales suplementos, momento de ingesta, etc."
                }
                {...register("supplementsDetails")}
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

export default Lifestyle;
