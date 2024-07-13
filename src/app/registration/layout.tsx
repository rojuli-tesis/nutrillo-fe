"use client";
import React, { useEffect, useState } from "react";

import CenteredBox from "@/app/components/positioning/CenteredBox";
import { usePathname, useRouter } from "next/navigation";
import { Box, CircularProgress, LinearProgress, styled } from "@mui/material";
import { steps } from "@/utils/constants/registration";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers";
import restClient from "@/utils/restClient";
import Logo from "@/common/logo";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 20,
  width: "100%",
}));

const RegistrationLayout = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const currentStep = steps.indexOf(pathname.replace("/registration/", ""));
  const totalSteps = steps.length;
  const progress = Math.round((currentStep / totalSteps) * 100);

  const checkNextStepToComplete = async () => {
    const userData = await restClient.get<{
      lastStep: string;
      finished: boolean;
    }>("/registration");
    if (userData) {
      if (userData.finished) {
        router.push("/");
        return;
      }
      const latestIndex = steps.findIndex((stp) => stp === userData.lastStep);
      router.push(`/registration/${steps[latestIndex + 1]}`);
      if (currentStep === latestIndex + 1) {
        setIsLoading(false);
      }
    } else {
      router.push(`/registration/${steps[0]}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkNextStepToComplete();
  }, [pathname]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Box sx={{ position: "relative" }}>
          <BorderLinearProgress value={progress} variant={"determinate"} />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: "50%",
            }}
          >
            {progress}%
          </Box>
        </Box>
        <CenteredBox
          sx={{
            margin: "20px 0",
          }}
        >
          <Logo />
        </CenteredBox>
        {isLoading ? (
          <CenteredBox>
            <CircularProgress />
          </CenteredBox>
        ) : (
          children
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default RegistrationLayout;
