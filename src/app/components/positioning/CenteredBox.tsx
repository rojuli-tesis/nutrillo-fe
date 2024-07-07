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
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...props.sx,
      }}
    >
      {children}
    </Box>
  );
};

export default CenteredBox;
