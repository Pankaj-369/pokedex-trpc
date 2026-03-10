"use client";

import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { PokemonRow } from "@/app/components/PokemonRow";
import { PokemonTable } from "@/app/components/PokemonTable";
import { trpc } from "@/trpc/client";

const panelSx = {
  borderRadius: 3,
  p: { xs: 2.5, md: 3 },
  border: "1px solid",
  borderColor: "divider",
  transition: "box-shadow 200ms ease, transform 200ms ease",
  "&:hover": { boxShadow: 4, transform: "translateY(-2px)" },
};

const getErrorMessage = (error: unknown): string => {
  if (!error) return "";
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return (error as Record<string, unknown>).message as string;
  }
  return "An error occurred. Please try again.";
};

export function NameSearchPanel() {
  const [nameInput, setNameInput] = useState("");
  const [submittedName, setSubmittedName] = useState("");

  const nameQuery = trpc.pokemon.getByName.useQuery(
    { name: submittedName },
    { enabled: submittedName.length > 0, retry: false, staleTime: 10 * 60 * 1000 },
  );

  return (
    <Paper sx={panelSx}>
      <Stack spacing={2.5}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Search By Name
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmittedName(nameInput.trim());
          }}
          sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}
        >
          <TextField
            fullWidth
            label="Type a Pokemon name..."
            placeholder="Type a Pokemon name..."
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={<SearchIcon />}
            disabled={!nameInput.trim() || nameQuery.isLoading}
            sx={{
              backgroundColor: "secondary.main",
              "&:hover": { backgroundColor: "secondary.dark", boxShadow: 6 },
            }}
          >
            Search
          </Button>
        </Box>

        {submittedName ? (
          nameQuery.error ? (
            <Alert severity="error">{getErrorMessage(nameQuery.error)}</Alert>
          ) : nameQuery.isLoading ? (
            <PokemonTable pokemon={[]} isLoading error={null} />
          ) : nameQuery.data ? (
            <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
              <Table>
                <TableHead sx={{ backgroundColor: "action.hover" }}>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: 700, width: "10%" }}>
                      ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, width: "40%" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>Types</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <PokemonRow pokemon={nameQuery.data} />
                </TableBody>
              </Table>
            </Box>
          ) : (
            <Alert severity="info">No Pokemon found.</Alert>
          )
        ) : (
          <Alert severity="info">Type a name and click Search to see a result.</Alert>
        )}
      </Stack>
    </Paper>
  );
}
