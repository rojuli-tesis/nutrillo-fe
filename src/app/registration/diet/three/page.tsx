"use client";

import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { DietDetails, steps } from "@/utils/constants/registration";
import CenteredBox from "@/app/components/positioning/CenteredBox";
import { useForm } from "react-hook-form";
import restClient from "@/utils/restClient";
import MultiselectCheckbox from "@/app/components/forms/MultiselectCheckbox";

const StepName = "diet/three";

const DietThree = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { handleSubmit, control } = useForm<Partial<DietDetails>>({
    defaultValues: {
      sweeteners: [],
      fats: [],
    },
  });

  const handleAbandon = async () => {
    await restClient.patch("/registration/abandon");
    router.push("/");
  };

  const saveAndClose = async (formData: Partial<DietDetails>) => {
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

  const goToNextStep = async (formData: Partial<DietDetails>) => {
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
        <Typography>Alimentacion Actual - Parte III</Typography>
      </CenteredBox>
      <Box
        sx={{
          padding: "16px 32px",
        }}
      >
        <form onSubmit={handleSubmit(goToNextStep)}>
          <Grid container rowGap={1}>
            <Grid item xs={12}>
              <Typography>Endulzantes - Consume:</Typography>
              <Box sx={{ paddingLeft: "20px" }}>
                <MultiselectCheckbox
                  name={"sweeteners"}
                  control={control}
                  includeOthers
                  othersLabel="Edulcorante no calorico"
                  othersTextPlaceholder={"Nombre del endulzante"}
                  options={[
                    { label: "Azucar blanco", value: "white-sugar" },
                    {
                      label: "Miel",
                      value: "honey",
                    },
                    {
                      label: "Azucar moreno",
                      value: "brown-sugar",
                    },
                  ]}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography>Para cocinar - Utiliza:</Typography>
              <Box sx={{ paddingLeft: "20px" }}>
                <MultiselectCheckbox
                  name={"fats"}
                  control={control}
                  includeOthers
                  options={[
                    { label: "Manteca", value: "butter" },
                    { label: "Aceite", value: "oil" },
                    { label: "Margarina", value: "margarine" },
                    { label: "Grasa animal", value: "animal-fat" },
                    { label: "Rocio vegetal", value: "vegetable-spray" },
                    {
                      label: "Aceite de oliva Virgen Extra",
                      value: "extra-virgin-olive-oil",
                    },
                  ]}
                />
              </Box>
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

export default DietThree;
