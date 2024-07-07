"use client";

import React from "react";
import * as z from "zod";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import CenteredBox from "@/app/components/positioning/CenteredBox";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import restClient from "@/utils/restClient";
import Logo from "@/common/logo";

const schema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .required();

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get("from");
  const fromAccountCreation = from === "account-created";

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "1234.Abcdef",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    restClient
      .post("/auth/login", data)
      .then((nextPath) => {
        router.push(nextPath);
      })
      .catch(console.error);
  };

  return (
    <Box
      sx={{
        padding: "0 20px",
      }}
    >
      <CenteredBox
        sx={{
          marginTop: "100px",
          padding: "20px 20px 20px 0px",
        }}
      >
        <Logo />
      </CenteredBox>
      {fromAccountCreation && (
        <Box
          sx={{
            backgroundColor: "success.light",
            padding: "12px 20px",
            borderRadius: "16px",
            fontSize: "14px",
            margin: "12px 0 50px 0",
          }}
        >
          <Typography
            sx={{
              color: "success.main",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            Cuenta creada
          </Typography>
          <Typography>
            Tu cuenta ha sido creada exitosamente! Para ingresar,{" "}
            <b>verifica tu email.</b> Puede que el correo de verificacion haya
            sido enviado a tu casilla de spam.
          </Typography>
        </Box>
      )}
      <CenteredBox>
        <form
          style={{ width: "100%", padding: "10px 36px" }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid container spacing={{ xs: 2 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={"Email"}
                type="email"
                autoComplete={"email"}
                {...register("email")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={"Contraseña"}
                type="password"
                autoComplete={"password"}
                {...register("password")}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ marginTop: "20px" }}
              >
                Ingresar
              </Button>
            </Grid>
          </Grid>
        </form>
      </CenteredBox>
    </Box>
  );
};

export default Login;
