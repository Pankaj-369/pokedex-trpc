"use client";

import { Alert, Paper, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { PokemonTable } from "@/app/components/PokemonTable";
import { CACHE_CONFIG } from "@/lib/cache-config";
import { PANEL_SX, getErrorMessage } from "@/lib/utils";
import { trpc } from "@/trpc/client";

export function NameSearchPanel() {
  const [nameInput, setNameInput] = useState("");
  const [debouncedName, setDebouncedName] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(nameInput.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [nameInput]);

  const nameQuery = trpc.pokemon.getByName.useQuery(
    { name: debouncedName },
    { ...CACHE_CONFIG.search, enabled: debouncedName.length > 0, retry: false },
  );

  return (
    <Paper sx={PANEL_SX}>
      <Stack spacing={2.5}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Search By Name
        </Typography>

        <TextField
          fullWidth
          label="Type a Pokemon name..."
          placeholder="Type a Pokemon name..."
          value={nameInput}
          onChange={(event) => setNameInput(event.target.value)}
          helperText="Results update automatically while you type."
        />

        {!debouncedName ? (
          <Alert severity="info">Type a name to see results.</Alert>
        ) : nameQuery.error ? (
          <Alert severity="error">{getErrorMessage(nameQuery.error)}</Alert>
        ) : (
          <PokemonTable
            pokemon={nameQuery.data ?? []}
            isLoading={nameQuery.isLoading}
            error={null}
          />
        )}
      </Stack>
    </Paper>
  );
}
