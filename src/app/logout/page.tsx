"use client";

import { CircularProgress, Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Clear authentication cookies
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Dispatch event to clear user context
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    
    // Redirect to login page after a short delay
    setTimeout(() => {
      router.replace('/login');
    }, 1000);
  }, [router]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.50",
      }}
    >
      <CircularProgress size={60} sx={{ mb: 2 }} />
      <Typography variant="h6" color="text.secondary">
        Cerrando sesión...
      </Typography>
    </Box>
  );
};

export default LogoutPage;
