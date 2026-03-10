"use client";

import SearchIcon from "@mui/icons-material/Search";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
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

        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            const nextName = nameInput.trim();
            if (!nextName) return;
            if (nextName === debouncedName) {
              void nameQuery.refetch();
              return;
            }
            setDebouncedName(nextName);
          }}
          sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "flex-start" }}
        >
          <TextField
            label="Type a Pokemon name..."
            placeholder="Type a Pokemon name..."
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
            helperText="Results update automatically while you type."
            sx={{ flex: 1, minWidth: 280 }}
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={<SearchIcon />}
            disabled={!nameInput.trim()}
            sx={{
              backgroundColor: "primary.main",
              "&:hover": { backgroundColor: "primary.dark", boxShadow: 6 },
            }}
          >
            Search
          </Button>
        </Box>

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
