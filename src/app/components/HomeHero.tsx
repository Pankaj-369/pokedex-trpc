"use client";

import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export function HomeHero() {
  const router = useRouter();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Grid
        container
        spacing={6}
        alignItems="center"
        sx={{
          opacity: 0,
          animation: "fadeUp 700ms ease forwards",
        }}
      >
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              lineHeight: 1.05,
              color: "text.primary",
              fontSize: { xs: "2.25rem", md: "3.75rem" },
            }}
          >
            Discover the world of Pokemon
          </Typography>
          <Typography variant="h6" sx={{ mt: 3, color: "text.secondary", maxWidth: 520 }}>
            Grab your Pokeball and search your favorite Pokemons in one place.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push("/search")}
            sx={{
              mt: 4,
              px: 4,
              py: 1.5,
              borderRadius: 3,
              backgroundColor: "secondary.main",
              transition: "transform 180ms ease, box-shadow 180ms ease",
              "&:hover": {
                backgroundColor: "secondary.dark",
                transform: "translateY(-2px) scale(1.02)",
                boxShadow: 8,
              },
            }}
          >
            Pokeball Search Pokemons
          </Button>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              transition: "transform 300ms ease",
              "&:hover": { transform: "scale(1.03)" },
            }}
          >
            <Box
              component="img"
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
              alt="Pikachu"
              sx={{
                width: "100%",
                maxWidth: 420,
                height: "auto",
                filter: "drop-shadow(0 22px 22px rgba(0,0,0,0.2))",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
