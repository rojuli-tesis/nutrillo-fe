"use client";

import React from "react";
import { Button } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { steps } from "@/utils/constants/registration";

const AdditionalInfo = () => {
  const pathname = usePathname();
  const router = useRouter();

  const goToNextStep = () => {
    const currentStep = steps.indexOf(pathname.replace("/registration/", ""));
    router.push(`/registration/${steps[currentStep + 1]}`);
  };
  return (
    <div>
      <h1>Additional Information</h1>
      <Button onClick={goToNextStep} variant={"contained"}>
        Siguiente
      </Button>
    </div>
  );
};

export default AdditionalInfo;
