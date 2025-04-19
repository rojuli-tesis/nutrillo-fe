"use client";

import React, { ReactNode } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { steps } from "@/utils/constants/registration";
import CenteredBox from "@/app/components/positioning/CenteredBox";
import { UseFormReturn, FieldValues } from "react-hook-form";
import restClient from "@/utils/restClient";

interface RegistrationStepProps<T extends FieldValues> {
  stepName: string;
  title: string;
  subtitle?: string;
  form: UseFormReturn<T>;
  children: ReactNode;
}

const RegistrationStep = <T extends FieldValues & { stepName?: string }>({
  stepName,
  title,
  subtitle,
  form,
  children,
}: RegistrationStepProps<T>) => {
  const pathname = usePathname();
  const router = useRouter();
  const { handleSubmit } = form;

  const saveAndClose = async (formData: T) => {
    try {
      await restClient.post(`/registration/${stepName.replace('/', '-')}`, {
        data: {
          ...formData,
          stepName,
        },
        saveAndClose: true,
      });
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  const goToNextStep = async (formData: T) => {
    try {
      await restClient.post(`/registration/${stepName.replace('/', '-')}`, {
        data: {
          ...formData,
          stepName,
        },
        saveAndClose: false,
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

  return (
    <div>
      <CenteredBox sx={{ flexDirection: "column" }}>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        {subtitle && <Typography>{subtitle}</Typography>}
      </CenteredBox>
      <Box
        sx={{
          padding: "16px 32px",
        }}
      >
        <form onSubmit={handleSubmit(goToNextStep)}>
          {children}
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
            variant={"outlined"}
            color={"secondary"}
            onClick={handleSubmit(saveAndClose)}
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

export default RegistrationStep; 