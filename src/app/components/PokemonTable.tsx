"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { PokemonRow } from "./PokemonRow";

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
}

interface PokedexTableProps {
  pokemon: Pokemon[];
  isLoading?: boolean;
  error?: Error | null;
}

export function PokemonTable({
  pokemon,
  isLoading,
  error,
}: PokedexTableProps) {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error loading Pokemon: {error.message}</Alert>;
  }

  if (pokemon.length === 0) {
    return (
      <Alert severity="info">No Pokemon found. Try adjusting your search.</Alert>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: 700, width: "10%" }}>
              ID
            </TableCell>
            <TableCell sx={{ fontWeight: 700, width: "40%" }}>
              Name
            </TableCell>
            <TableCell sx={{ fontWeight: 700, width: "50%" }}>
              Types
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pokemon.map((p) => (
            <PokemonRow key={p.id} pokemon={p} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}