"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import CenteredBox from "@/app/components/positioning/CenteredBox";
import { Box, Grid, TextField, Typography, Button } from "@mui/material";
import restClient from "@/utils/restClient";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import Image from "next/image";

interface InviteData {
  email: string;
  firstName: string;
  lastName: string;
  code: string;
}

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .required()
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

const InviteWithCodePage = ({
  params: { inviteCode },
}: {
  params: {
    inviteCode: string;
  };
}) => {
  const [inviteData, setInviteData] = useState<InviteData>();

  const router = useRouter();

  const getInviteData = async (): Promise<RegisterForm> => {
    return restClient
      .get<InviteData>(`/invite/${inviteCode}`)
      .then((data) => {
        setInviteData(data);
        return {
          email: data.email,
          password: "",
          confirmPassword: "",
        };
      })
      .catch((error) => {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          enqueueSnackbar("Codigo Invalido", {
            variant: "error",
            preventDuplicate: true,
          });
          // redirect to invite
          router.push("/invite");
        }
        return { email: "", password: "", confirmPassword: "" };
      });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    defaultValues: async () => getInviteData(),
  });

  const onSubmit = ({ email, password }: RegisterForm) => {
    restClient
      .post("/auth/signup", {
        email,
        password,
        firstName: inviteData?.firstName,
        lastName: inviteData?.lastName,
        inviteCode: inviteCode,
      })
      .then(() => {
        enqueueSnackbar(
          "Invitacion aceptada, revisa tu correo y verifica tu email para ingresar.",
          {
            variant: "success",
            preventDuplicate: true,
          },
        );
        router.push("/login?from=account-created");
      })
      .catch((error) => {
        // handle errors !!
      });
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <CenteredBox
        sx={{
          marginTop: "100px",
          padding: "20px 20px 20px 0px",
        }}
      >
        <Image
          width={163}
          height={47}
          src={"../nutrillo-logo.svg"}
          alt={"nutrillo"}
        />
      </CenteredBox>
      <CenteredBox
        sx={{
          padding: "20px 20px 20px 0px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "0 40px",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "26px" }}>
            Hola {inviteData?.firstName}!
          </Typography>
          <Typography sx={{ fontsize: "20px" }}>
            Recibiste una invitacion para usar
            <b> Nutrillo</b>.
          </Typography>
          <Box
            sx={{
              backgroundColor: "secondary.light",
              padding: "12px 20px",
              borderRadius: "16px",
              fontSize: "14px",
              marginTop: "12px",
            }}
          >
            Luego de completar informacion basica para tu perfil, podes agilizar
            el proceso completando datos adicionales para la primera consulta.
          </Box>
        </Box>
      </CenteredBox>
      <CenteredBox>
        <form
          style={{ width: "100%", padding: "10px 36px" }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid container spacing={{ xs: 2 }}>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={"Email"}
                    autoComplete={"email"}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={"Contraseña"}
                type="password"
                autoComplete={"new-password"}
                {...register("password")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label={"Confirmar contraseña"}
                autoComplete={"confirm-password"}
                {...register("confirmPassword")}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type={"submit"} variant={"contained"} fullWidth>
                Crear cuenta
              </Button>
            </Grid>
          </Grid>
        </form>
      </CenteredBox>
    </Box>
  );
};

export default InviteWithCodePage;
