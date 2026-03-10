"use client";

import SearchIcon from "@mui/icons-material/Search";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";

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

const parseNames = (input: string) =>
  input
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

const getErrorMessage = (error: unknown): string => {
  if (!error) return "";
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return (error as Record<string, unknown>).message as string;
  }
  return "An error occurred. Please try again.";
};

export function MultiNameSearchPanel() {
  const [multiInput, setMultiInput] = useState("");
  const [submittedNames, setSubmittedNames] = useState<string[]>([]);

  const parsedNames = useMemo(() => parseNames(multiInput), [multiInput]);

  const multiNameQuery = trpc.pokemon.getByNames.useQuery(
    { names: submittedNames },
    { enabled: submittedNames.length > 0, retry: false },
  );

  return (
    <Paper sx={panelSx}>
      <Stack spacing={2.5}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Search By Multi Name
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmittedNames(parsedNames);
          }}
          sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}
        >
          <TextField
            fullWidth
            label="Type multiple Pokemon names separated by commas"
            placeholder="pikachu, charizard, bulbasaur"
            value={multiInput}
            onChange={(e) => setMultiInput(e.target.value)}
            helperText="Example: pikachu, charizard, bulbasaur"
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={<SearchIcon />}
            disabled={parsedNames.length === 0 || multiNameQuery.isLoading}
            sx={{
              backgroundColor: "primary.main",
              "&:hover": { backgroundColor: "primary.dark", boxShadow: 6 },
            }}
          >
            Search
          </Button>
        </Box>

        {submittedNames.length > 0 ? (
          <PokemonTable
            pokemon={multiNameQuery.data ?? []}
            isLoading={multiNameQuery.isLoading}
            error={multiNameQuery.error ? new Error(getErrorMessage(multiNameQuery.error)) : null}
          />
        ) : (
          <Alert severity="info">Enter comma-separated names and click Search to see results.</Alert>
        )}
      </Stack>
    </Paper>
  );
}
