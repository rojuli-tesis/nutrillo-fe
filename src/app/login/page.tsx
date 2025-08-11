"use client";

import React, { useEffect, Suspense } from "react";
import * as z from "zod";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Alert,
  AlertTitle,
  CircularProgress,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import restClient from "@/utils/restClient";
import { Snackbar } from "@mui/material";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
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
      email: "julietarey.lp+juanperez1@gmail.com",
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
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Grid container direction="column" spacing={4}>
          <Grid item>
            <Typography variant="h4" color="primary" align="center" gutterBottom>
              Welcome Back
            </Typography>
          </Grid>

          {fromAccountCreation && (
            <Grid item>
              <Alert severity="success">
                <AlertTitle>Account created successfully!</AlertTitle>
                Please verify your email before logging in. Check your spam folder if you haven&apos;t received the verification email.
              </Alert>
            </Grid>
          )}

          <Grid item>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                width: "100%",
                maxWidth: "400px",
                mx: "auto",
                p: 3,
                borderRadius: 2,
                bgcolor: "background.paper",
                boxShadow: 1,
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    {...register("email")}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    {...register("password")}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isSubmitting}
                    sx={{ mt: 2 }}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : "Sign In"}
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
        message="Invalid email or password"
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
