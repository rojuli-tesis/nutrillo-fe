"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";
import restClient from "@/utils/restClient";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restClient.get<{ userId: number, firstName: string }>("/auth/me")
      .then(() => {
        router.replace("/home");
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [router]);

  const handleLogin = () => {
    router.push("/login");
  };


  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "grey.50",
      }}
    >
      <Container maxWidth="sm">
        <Grid container direction="column" spacing={4} alignItems="center">
          <Grid item>
            <Typography variant="h2" color="primary" align="center">
              Nutrillo
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h5" color="text.secondary" align="center">
              Tu nutricionista de bolsillo
            </Typography>
          </Grid>
          <Grid item container direction="column" spacing={2} sx={{ maxWidth: 400 }}>
            <Grid item>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleLogin}
              >
                Iniciar sesión
              </Button>
            </Grid>
            {/* <Grid item>
            TODO: invitation flow
              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={handleRegister}
              >
                Crear cuenta
              </Button>
            </Grid> */}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
