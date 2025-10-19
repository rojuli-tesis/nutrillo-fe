"use client";

import React, { useEffect, Suspense } from "react";
import * as z from "zod";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Alert,
  AlertTitle,
  CircularProgress,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import restClient from "@/utils/restClient";
import { Snackbar } from "@mui/material";
import Logo from "@/common/logo";

const schema = z.object({
  email: z.string().email("Dirección de correo inválida"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type LoginForm = z.infer<typeof schema>;

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showError, setShowError] = React.useState(false);
  const from = searchParams.get("from");
  const fromAccountCreation = from === "account-created";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "julietarey.lp+juanperez2@gmail.com",
      password: "Contrasenia1!",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const nextPath = await restClient.post("/auth/login", data);
      router.replace(nextPath);
    } catch (error) {
      setShowError(true);
    }
  };

  // Check if already authenticated
  useEffect(() => {
    restClient.get("/auth/me")
      .then(() => {
        router.replace("/home");
      })
      .catch(() => {
        // Not authenticated, stay on login page
      });
  }, [router]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.50",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Container 
        maxWidth="sm" 
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid container direction="column" spacing={3} sx={{ width: "100%" }}>
          <Grid item sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Logo />  
          </Grid>

          {fromAccountCreation && (
            <Grid item>
              <Alert severity="success">
                <AlertTitle>¡Cuenta creada exitosamente!</AlertTitle>
                Por favor verifica tu correo electrónico antes de iniciar sesión. Revisa tu carpeta de spam si no has recibido el correo de verificación.
              </Alert>
            </Grid>
          )}

          <Grid item>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                maxWidth: "400px",
                mx: "auto",
                p: "32px 12px",
                borderRadius: 3,
                bgcolor: "background.paper",
                boxShadow: 3,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Correo Electrónico"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    {...register("email")}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contraseña"
                    type="password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    {...register("password")}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isSubmitting}
                    sx={{ 
                      mt: 2,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                    }}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : "Iniciar Sesión"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={() => setShowError(false)}
        message="Correo electrónico o contraseña inválidos"
      />
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
