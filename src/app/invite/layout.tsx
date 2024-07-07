"use client";

import React from "react";
import { SnackbarProvider } from "notistack";

const InviteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SnackbarProvider />
      {children}
    </div>
  );
};
export default InviteLayout;
