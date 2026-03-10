"use client";

import { Box, Paper, Typography } from "@mui/material";

import { FilterablePokedexTable } from "@/app/components/FilterablePokedexTable";
import { PANEL_SX } from "@/lib/utils";

export function TypeSearchPanel() {
  return (
    <Paper sx={{ ...PANEL_SX, p: 0 }}>
      <Box sx={{ p: 3, pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Search By Type
        </Typography>
      </Box>
      <FilterablePokedexTable />
    </Paper>
  );
}
