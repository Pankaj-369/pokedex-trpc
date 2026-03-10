"use client";

import { Box, Container, Fade, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";

import { AppNavbar } from "@/app/components/AppNavbar";
import { MultiNameSearchPanel } from "@/app/components/search/MultiNameSearchPanel";
import { NameSearchPanel } from "@/app/components/search/NameSearchPanel";
import { TypeSearchPanel } from "@/app/components/search/TypeSearchPanel";

const tabsCardSx = {
  borderRadius: 3,
  p: 1.25,
  border: "1px solid",
  borderColor: "divider",
  transition: "box-shadow 200ms ease, transform 200ms ease",
  "&:hover": { boxShadow: 4, transform: "translateY(-2px)" },
};

export default function SearchPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "radial-gradient(circle at top left, rgba(225, 29, 72, 0.14), transparent 35%), radial-gradient(circle at top right, rgba(255, 208, 0, 0.12), transparent 45%), transparent"
            : "radial-gradient(circle at top left, rgba(230,57,70,0.10), transparent 35%), radial-gradient(circle at top right, rgba(255, 208, 0, 0.20), transparent 45%), transparent",
      }}
    >
      <AppNavbar actionLabel="Home" actionHref="/" />

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: "text.primary" }}>
              Search Pokemons
            </Typography>
            <Typography color="text.secondary">
              Switch modes to search by single name, multiple names, or type.
            </Typography>
          </Box>

          <Paper sx={tabsCardSx}>
            <Tabs
              value={tab}
              onChange={(_, value: number) => setTab(value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": { fontWeight: 700, textTransform: "none" },
                "& .MuiTabs-indicator": { height: 4, borderRadius: 99, backgroundColor: "secondary.main" },
              }}
            >
              <Tab label="Search By Name" />
              <Tab label="Search By Multi Name" />
              <Tab label="Search By Type" />
            </Tabs>
          </Paper>

          <Fade in={tab === 0} mountOnEnter unmountOnExit timeout={220}>
            <Box>
              <NameSearchPanel />
            </Box>
          </Fade>

          <Fade in={tab === 1} mountOnEnter unmountOnExit timeout={220}>
            <Box>
              <MultiNameSearchPanel />
            </Box>
          </Fade>

          <Fade in={tab === 2} mountOnEnter unmountOnExit timeout={220}>
            <Box>
              <TypeSearchPanel />
            </Box>
          </Fade>
        </Stack>
      </Container>
    </Box>
  );
}
