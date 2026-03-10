"use client";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import { AppBar, Box, Button, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

import { useColorMode } from "@/app/providers";

type AppNavbarProps = {
  actionLabel?: string;
  actionHref?: string;
};

export function AppNavbar({ actionLabel, actionHref }: AppNavbarProps) {
  const { mode, toggleMode } = useColorMode();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", gap: 1 }}>
        <Stack
          component={Link}
          href="/"
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ textDecoration: "none", color: "text.primary" }}
        >
          <CatchingPokemonIcon sx={{ color: "secondary.main" }} />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            PokeDex
          </Typography>
        </Stack>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {actionLabel && actionHref && (
            <Button component={Link} href={actionHref} variant="outlined" color="primary">
              {actionLabel}
            </Button>
          )}
          <IconButton color="primary" aria-label="toggle theme" onClick={toggleMode}>
            {mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
