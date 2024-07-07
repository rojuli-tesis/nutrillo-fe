"use client";

import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { DietDetails, steps } from "@/utils/constants/registration";
import CenteredBox from "@/app/components/positioning/CenteredBox";
import { useForm } from "react-hook-form";
import restClient from "@/utils/restClient";
import MultiselectCheckbox from "@/app/components/forms/MultiselectCheckbox";

const StepName = "diet/one";

const DietOne = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { handleSubmit, control } = useForm<Partial<DietDetails>>({
    defaultValues: {
      liquids: [],
      sweets: [],
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
        <Typography>Alimentacion Actual - Parte I</Typography>
      </CenteredBox>
      <Box
        sx={{
          padding: "16px 32px",
        }}
      >
        <form onSubmit={handleSubmit(goToNextStep)}>
          <Grid container rowGap={1}>
            <Grid item xs={12}>
              <Typography>Liquidos - Consume:</Typography>
              <Box sx={{ paddingLeft: "20px" }}>
                <MultiselectCheckbox
                  name={"liquids"}
                  control={control}
                  options={[
                    { label: "Agua", value: "water" },
                    {
                      label: "Soda",
                      value: "sparkling-water",
                    },
                    {
                      label: "Gaseosas",
                      value: "soda",
                    },
                    {
                      label: "Jugos",
                      value: "juice",
                    },
                    {
                      label: "Aguas saborizadas",
                      value: "flavored-water",
                    },
                  ]}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography>Dulces - Consume:</Typography>
              <Box sx={{ paddingLeft: "20px" }}>
                <MultiselectCheckbox
                  name={"sweets"}
                  control={control}
                  options={[
                    {
                      label: "Chocolate",
                      value: "chocolate",
                    },
                    {
                      label: "Helado",
                      value: "ice-cream",
                    },
                    {
                      label: "Galletas",
                      value: "cookies",
                    },
                    {
                      label: "Caramelos",
                      value: "candies",
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

export default DietOne;
