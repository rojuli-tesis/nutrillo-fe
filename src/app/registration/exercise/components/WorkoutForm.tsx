import React from "react";
import { Box, Grid, IconButton, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Workout } from "@/utils/constants/registration";

const WorkoutForm = ({
  onRemove,
  onFieldChange,
  index,
}: {
  onRemove: () => void;
  index: number;
  onFieldChange: (
    fieldName: keyof Workout,
    index: number,
  ) => (evt: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <Box sx={{ marginBottom: "8px" }}>
      <Grid
        container
        sx={{
          rowGap: "8px",
        }}
      >
        <Grid item xs={11}>
          <Typography sx={{ fontWeight: "bold", padding: "12px" }}>
            Ejercicio {index + 1}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          {index > 0 && (
            <IconButton color={"error"} onClick={onRemove}>
              <DeleteIcon />
            </IconButton>
          )}
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size={"small"}
            label={"Nombre"}
            onChange={onFieldChange("name", index)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size={"small"}
            label={"Frecuencia"}
            onChange={onFieldChange("frequency", index)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size={"small"}
            label={"Duracion de la actividad"}
            onChange={onFieldChange("duration", index)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size={"small"}
            label={"Año de inicio"}
            onChange={onFieldChange("startingYear", index)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size={"small"}
            label={"Lugar"}
            onChange={onFieldChange("place", index)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
export default WorkoutForm;
