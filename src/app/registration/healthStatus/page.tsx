"use client";

import React from "react";
import {
  Box,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { steps } from "@/utils/constants/registration";
import CenteredBox from "@/app/components/positioning/CenteredBox";
import { Controller, useForm } from "react-hook-form";
import { FormControl } from "@mui/base";
import restClient from "@/utils/restClient";
import { HealthStatus as HealthStatusInterface } from "@/utils/constants/registration";

const StepName = "healthStatus";

const HealthStatus = () => {
  const pathname = usePathname();
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<HealthStatusInterface>({
    defaultValues: {
      diagnosedIllness: "",
      medication: "",
      weightLossMeds: "",
    },
  });

  const handleAbandon = async () => {
    await restClient.patch("/registration/abandon");
    router.push("/");
  };

  const saveAndClose = async (formData: HealthStatusInterface) => {
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

  const goToNextStep = async (formData: HealthStatusInterface) => {
    try {
      await restClient.post(`/registration/${StepName}`, {
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
        <Typography>Estado de salud</Typography>
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
                {/* TODO: this should allow multiple select */}
                <InputLabel id="diagnosedIllness">
                  Enfermedades diagnosticadas
                </InputLabel>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId={"diagnosedIllness"}
                        fullWidth
                        displayEmpty
                        {...field}
                      >
                        <MenuItem disabled value="">
                          Selecciona una opcion
                        </MenuItem>
                        <MenuItem value="none">Ninguna</MenuItem>
                        <MenuItem value="diabetes">Diabetes</MenuItem>
                        <MenuItem value="hepatitis">Hepatitis</MenuItem>
                        <MenuItem value="highCholesterol">
                          Colesterol alto
                        </MenuItem>
                        <MenuItem value="highBloodPressure">
                          Presion arterial alta
                        </MenuItem>
                        <MenuItem value="ibs">
                          Sindrome de colon irritable
                        </MenuItem>
                        <MenuItem value="kidney">Enfermedad renal</MenuItem>
                        <MenuItem value="thyroid">
                          Tiroides (hiper/hipotiroidismo)
                        </MenuItem>
                        <MenuItem value="tda">TDA</MenuItem>
                        <MenuItem value="other">Otra</MenuItem>
                      </Select>
                    );
                  }}
                  name={"diagnosedIllness"}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <InputLabel id="medication">Toma medicamentos?</InputLabel>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId={"medication"}
                        fullWidth
                        displayEmpty
                        {...field}
                      >
                        <MenuItem disabled value="">
                          Selecciona una opcion
                        </MenuItem>
                        <MenuItem value={"none"}>Ninguno</MenuItem>
                        <MenuItem value={"diabetes"}>Diabetes</MenuItem>
                        <MenuItem value={"birthControl"}>
                          Anticonceptivos
                        </MenuItem>
                        <MenuItem value={"antidepressants"}>
                          Antidepresivos
                        </MenuItem>
                        <MenuItem value={"other"}>Otros</MenuItem>
                      </Select>
                    );
                  }}
                  name={"medication"}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <InputLabel id="weightLossMeds">
                  Tomas medicamentos para bajar de peso?
                </InputLabel>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => {
                    return (
                      <Select
                        labelId={"weightLossMeds"}
                        fullWidth
                        displayEmpty
                        {...field}
                      >
                        <MenuItem disabled value="">
                          Selecciona una opcion
                        </MenuItem>
                        <MenuItem value={"none"}>Ninguno</MenuItem>
                        <MenuItem value={"prescribed"}>Recetados</MenuItem>
                        <MenuItem value={"overTheCounter"}>Sin receta</MenuItem>
                      </Select>
                    );
                  }}
                  name={"weightLossMeds"}
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

export default HealthStatus;
