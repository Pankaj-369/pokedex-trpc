"use client";

import { Box } from "@mui/material";

import { AppNavbar } from "@/app/components/AppNavbar";
import { HomeHero } from "@/app/components/HomeHero";

export default function HomePage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "radial-gradient(circle at top right, rgba(255, 208, 0, 0.14), transparent 40%), linear-gradient(180deg, #0b1220 0%, #111a2b 100%)"
            : "radial-gradient(circle at top right, rgba(255, 227, 106, 0.35), transparent 40%), linear-gradient(180deg, rgba(249, 251, 255, 0.9) 0%, rgba(238, 244, 255, 0.9) 100%)",
      }}
    >
      <AppNavbar actionLabel="Search" actionHref="/search" />
      <HomeHero />
    </Box>
  );
}
