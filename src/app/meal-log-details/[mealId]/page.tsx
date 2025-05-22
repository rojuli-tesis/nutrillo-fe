"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Box, Typography, Button, Card, Stack, CircularProgress, Container } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { getMealLog, translateMealType } from "../../meal-log-list/helpers";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { MealLog } from "@/types/meals";
import MainLayout from "../../components/MainLayout";


const MealLogDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { mealId } = params;
  const [log, setLog] = useState<MealLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchLog = async () => {
      const log = await getMealLog(mealId as string);
      setLog(log);
      setIsLoading(false);
    };
    fetchLog();
  }, [mealId]);

  // TODO: allow deletion and editing of log description
  // photo? not sure

  return (
    <MainLayout>
      <Container maxWidth="sm" sx={{ py: 1 }}>
        <Box maxWidth="sm" mx="auto" px={2}>
          <Button
            variant="text"
            color="inherit"
            onClick={() => router.back()}
            startIcon={<ArrowBack />}
            sx={{ mb: 2 }}
          >
            Volver
          </Button>
          <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
            {translateMealType(log?.mealType || "")} - {dayjs(log?.date || "").locale("es").format("DD [de] MMMM YYYY, HH:mm")}
          </Typography>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : log && (
            <Card sx={{ p: 3, mb: 3 }}>
              <Stack spacing={3} alignItems="center">
                {log.photoUrl && (
                  <Box
                    sx={{
                      width: "100%",
                      maxWidth: 400,
                      maxHeight: 300,
                      overflow: "hidden",
                      borderRadius: 2,
                      mb: 2,
                    }}
                  >
                    <img
                      src={log.photoUrl}
                      alt="Meal"
                      style={{ width: "100%", height: "auto", objectFit: "cover" }}
                    />
                  </Box>
                )}
         
                <Typography variant="body2" color="text.secondary">
                  {dayjs(log.createdAt).locale("es").format("DD [de] MMMM YYYY, HH:mm")}
                </Typography>
                {log.description && (
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {log.description}
                  </Typography>
                )}
              </Stack>
            </Card>
          )}
        </Box>
      </Container>
    </MainLayout>
  );
};

export default MealLogDetailPage; 