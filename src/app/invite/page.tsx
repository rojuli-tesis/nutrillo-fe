"use client";

import React from "react";
import { Box, TextField, Typography, Button, Paper, Container, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { SnackbarProvider } from "notistack";
import Logo from "@/common/logo";

const InvitePage = () => {
  const [code, setCode] = React.useState("");
  const router = useRouter();
  
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

          <Grid item>
            <Paper
              elevation={3}
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
              <Typography
                variant="h6"
                sx={{
                  textAlign: "center",
                  mb: 3,
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                }}
              >
                Ingresa el código que te enviaron para unirte:
              </Typography>
              <TextField
                fullWidth
                placeholder="Código de invitación"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputProps={{
                  style: {
                    textAlign: "center",
                    fontSize: "20px",
                    letterSpacing: "0.1em",
                  },
                }}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                variant="contained"
                fullWidth
                size="large"
                disabled={code.length !== 6}
                onClick={() => router.push(`/invite/${code}`)}
                sx={{ 
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                }}
              >
                Aceptar
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InvitePage;
