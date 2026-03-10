"use client";

import { Box, Paper, Typography } from "@mui/material";

import { FilterablePokedexTable } from "@/app/components/FilterablePokedexTable";

const panelSx = {
  borderRadius: 3,
  border: "1px solid",
  borderColor: "divider",
  transition: "box-shadow 200ms ease, transform 200ms ease",
  "&:hover": { boxShadow: 4, transform: "translateY(-2px)" },
};

export function TypeSearchPanel() {
  return (
    <Paper sx={panelSx}>
      <Box sx={{ p: 3, pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Search By Type
        </Typography>
      </Box>
      <FilterablePokedexTable typeOnly />
    </Paper>
  );
}
