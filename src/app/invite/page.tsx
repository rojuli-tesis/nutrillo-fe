"use client";

import React from "react";
import { Box, TextField, Typography, Button, Paper } from "@mui/material";
import CenteredBox from "@/app/components/positioning/CenteredBox";
import { useRouter } from "next/navigation";
import { SnackbarProvider } from "notistack";

const InvitePage = () => {
  const [code, setCode] = React.useState("");
  const router = useRouter();
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
        <img src={`nutrillo-logo.svg`} alt="nutrillo" />
      </CenteredBox>
      <CenteredBox
        sx={{
          padding: "20px 20px 20px 0px",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: "80%",
            padding: "20px 20px",
            borderRadius: "16px",
          }}
        >
          <Typography
            sx={{
              paddingBottom: "16px",
            }}
          >
            Ingresa el codigo que te enviaron para unirte:
          </Typography>
          <TextField
            fullWidth
            sx={{ padding: "10px 0" }}
            inputProps={{
              style: {
                textAlign: "center",
                fontSize: "24px",
              },
            }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button
            variant="contained"
            fullWidth
            disabled={code.length != 6}
            onClick={() => router.push(`/invite/${code}`)}
          >
            Aceptar
          </Button>
        </Paper>
      </CenteredBox>
    </Box>
  );
};

export default InvitePage;
