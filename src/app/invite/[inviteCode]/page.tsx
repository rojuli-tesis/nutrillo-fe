"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import CenteredBox from "@/app/components/positioning/CenteredBox";
import { Box, Grid, TextField, Typography, Button, Container } from "@mui/material";
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
    formState: { errors, isSubmitting },
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
        // Clear authentication cookies to prevent auto-login
        document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
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
            <Image
              width={163}
              height={47}
              src={"../nutrillo-logo.svg"}
              alt={"nutrillo"}
            />
          </Grid>

          <Grid item>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                mb: 3,
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                  mb: 1,
                  fontWeight: 600,
                }}
              >
                ¡Hola {inviteData?.firstName}!
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  mb: 2,
                  color: "text.secondary",
                }}
              >
                Recibiste una invitación para usar <b>Nutrillo</b>.
              </Typography>
              <Box
                sx={{
                  backgroundColor: "secondary.light",
                  padding: { xs: "12px 16px", sm: "16px 20px" },
                  borderRadius: 2,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  maxWidth: "400px",
                  textAlign: "center",
                }}
              >
                Luego de completar información básica para tu perfil, podés agilizar
                el proceso completando datos adicionales para la primera consulta.
              </Box>
            </Box>
          </Grid>

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
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Correo Electrónico"
                        autoComplete="email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        InputLabelProps={{
                          shrink: (inviteData?.email || '').length > 0,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contraseña"
                    type="password"
                    autoComplete="new-password"
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
                  <TextField
                    fullWidth
                    type="password"
                    label="Confirmar Contraseña"
                    autoComplete="confirm-password"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
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
                    disabled={isSubmitting} 
                    variant="contained" 
                    fullWidth
                    size="large"
                    sx={{ 
                      mt: 2,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                    }}
                  >
                    {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InviteWithCodePage;
