"use client";

import SearchIcon from "@mui/icons-material/Search";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

import { PokemonTable } from "@/app/components/PokemonTable";
import { CACHE_CONFIG } from "@/lib/cache-config";
import { PANEL_SX, getErrorMessage } from "@/lib/utils";
import { trpc } from "@/trpc/client";

export function NameSearchPanel() {
  const [nameInput, setNameInput] = useState("");
  const [submittedName, setSubmittedName] = useState("");

  const nameQuery = trpc.pokemon.getByName.useQuery(
    { name: submittedName },
    { ...CACHE_CONFIG.search, enabled: submittedName.length > 0, retry: false },
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
            if (nextName === submittedName) {
              void nameQuery.refetch();
              return;
            }
            setSubmittedName(nextName);
          }}
          sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "flex-start" }}
        >
          <TextField
            label="Type a Pokemon name..."
            placeholder="Type a Pokemon name..."
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
            helperText="Press Enter or click Search to see results."
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

        {!submittedName ? (
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
