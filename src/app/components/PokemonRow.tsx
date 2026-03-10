"use client";

import {
  TableRow,
  TableCell,
  Avatar,
  Box,
  Chip,
  Stack,
} from "@mui/material";

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
}

const typeColors: Record<string, string> = {
  grass: "#78C850",
  poison: "#A040A0",
  fire: "#F08030",
  flying: "#A890F0",
  water: "#6890F0",
  electric: "#F8D030",
  normal: "#A8A878",
  ground: "#E0C068",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  steel: "#B8B8D0",
  psychic: "#F85888",
  ice: "#98D8D8",
  dragon: "#7038F8",
  dark: "#705848",
  fairy: "#EE99AC",
};

export function PokemonRow({ pokemon }: { pokemon: Pokemon }) {
  return (
    <TableRow
      hover
      sx={{
        "&:hover": {
          backgroundColor: "#f5f5f5",
        },
        "&:hover .pokemon-avatar": {
          transform: "scale(1.12)",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.18)",
        },
      }}
    >
      <TableCell align="center" sx={{ fontWeight: 600 }}>
        #{pokemon.id}
      </TableCell>
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            className="pokemon-avatar"
            src={pokemon.sprite}
            alt={pokemon.name}
            sx={{
              width: 56,
              height: 56,
              backgroundColor: "#f0f0f0",
              transition: "transform 220ms ease, box-shadow 220ms ease",
              "&:hover": {
                transform: "scale(1.12)",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.18)",
              },
            }}
          />
          <span style={{ fontWeight: 500 }}>{pokemon.name}</span>
        </Box>
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={1}>
          {pokemon.types.map((type) => (
            <Chip
              key={type}
              label={type.charAt(0).toUpperCase() + type.slice(1)}
              size="small"
              sx={{
                backgroundColor: typeColors[type] || "#999",
                color: "white",
                fontWeight: 500,
              }}
            />
          ))}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
