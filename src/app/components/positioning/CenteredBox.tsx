import React, { ReactNode } from "react";
import { Box, SxProps } from "@mui/material";

const CenteredBox = ({
  children,
  ...props
}: {
  children: ReactNode;
  sx?: SxProps;
}) => {
  return (
    <Box
      {...props}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: "0 32px",
        ...props.sx,
      }}
    >
      {children}
    </Box>
  );
};

export default CenteredBox;
