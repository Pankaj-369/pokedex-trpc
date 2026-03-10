"use client";

import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";

const pokemonImageSx = {
  width: "100%",
  maxWidth: { xs: 250, sm: 300, md: 360 },
  height: "auto",
  filter: "drop-shadow(0 22px 22px rgba(0,0,0,0.2))",
  transition: "transform 260ms ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
};

export function HomeHero() {
  const router = useRouter();

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: { xs: "calc(100vh - 64px)", md: "calc(100vh - 72px)" },
        display: "flex",
        alignItems: "center",
        py: { xs: 8, md: 10 },
      }}
    >
      <Grid
        container
        spacing={{ xs: 3, md: 4 }}
        alignItems="center"
        sx={{
          width: "100%",
          opacity: 0,
          animation: "fadeUp 700ms ease forwards",
        }}
      >
        <Grid size={{ xs: 12, md: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-start" },
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                width: { xs: 220, md: 260 },
                height: { xs: 220, md: 260 },
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,208,0,0.26) 0%, rgba(255,208,0,0.08) 46%, rgba(255,208,0,0) 72%)",
                zIndex: 0,
              },
            }}
          >
            <Box
              component="img"
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
              alt="Pikachu"
              sx={{ ...pokemonImageSx, position: "relative", zIndex: 1 }}
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ textAlign: "center", px: { xs: 1, md: 2 } }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                lineHeight: 1.05,
                color: "text.primary",
                fontSize: { xs: "2.05rem", md: "3.25rem" },
                textWrap: "balance",
              }}
            >
              Explore the World of Pokemon
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mt: 2.5,
                color: "text.secondary",
                maxWidth: 640,
                mx: "auto",
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              Your digital Pokedex to discover, compare, and explore Pokemon.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => router.push("/search")}
              sx={{
                mt: 3.5,
                px: 4.5,
                py: 1.35,
                borderRadius: 999,
                fontWeight: 700,
                backgroundColor: "secondary.main",
                transition: "transform 180ms ease, box-shadow 180ms ease",
                "&:hover": {
                  backgroundColor: "secondary.dark",
                  transform: "translateY(-2px)",
                  boxShadow: 8,
                },
              }}
            >
              Open Your Pokedex<CatchingPokemonIcon/>
            </Button>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-end" },
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                width: { xs: 220, md: 260 },
                height: { xs: 220, md: 260 },
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,87,34,0.22) 0%, rgba(255,87,34,0.08) 44%, rgba(255,87,34,0) 72%)",
                zIndex: 0,
              },
            }}
          >
            <Box
              component="img"
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png"
              alt="Charizard"
              sx={{ ...pokemonImageSx, position: "relative", zIndex: 1 }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
