import React from "react";
import { Box, Button, Typography, Stack } from "@mui/material";

const Sidebar = ({ setFilterType, filterType }) => {
  const filters = ["all", "wifi", "cellular", "bluetooth"];

  return (
    <Box
      sx={{
        width: 250,
        height: "100vh",
        backgroundColor: "#f0f0f0",
        padding: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
        Filters
      </Typography>

      <Stack spacing={2}>
        {filters.map((type) => (
          <Button
            key={type}
            variant={filterType === type ? "contained" : "outlined"}
            color="primary"
            onClick={() => setFilterType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default Sidebar;
