"use client";

import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { PokemonTable } from "@/app/components/PokemonTable";
import { CACHE_CONFIG } from "@/lib/cache-config";
import { PANEL_SX, getErrorMessage } from "@/lib/utils";
import { trpc } from "@/trpc/client";

const dedupeNames = (names: string[]) => {
  const seen = new Set<string>();
  return names.filter((name) => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export function MultiNameSearchPanel() {
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [submittedNames, setSubmittedNames] = useState<string[]>([]);

  const multiNameQuery = trpc.pokemon.getByNames.useQuery(
    { names: submittedNames },
    { ...CACHE_CONFIG.search, enabled: submittedNames.length > 0, retry: false },
  );

  const addPendingName = () => {
    const pending = inputValue.trim();
    if (!pending) return selectedNames;
    const next = dedupeNames([...selectedNames, pending]);
    setSelectedNames(next);
    setInputValue("");
    return next;
  };

  return (
    <Paper sx={PANEL_SX}>
      <Stack spacing={2.5}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Search By Multi Name
        </Typography>

        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            const names = addPendingName();
            setSubmittedNames(names);
          }}
          sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}
        >
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={selectedNames}
            inputValue={inputValue}
            onInputChange={(_, nextInput) => setInputValue(nextInput)}
            onChange={(_, nextValues) => setSelectedNames(dedupeNames(nextValues))}
            filterOptions={(options) => options}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} key={option} />
              ))
            }
            sx={{ flex: 1, minWidth: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Type Pokemon names and press Enter"
                placeholder="pikachu"
                helperText="Press Enter after each name to add it."
                onKeyDown={(event) => {
                  if (event.key === "Enter" && inputValue.trim()) {
                    event.preventDefault();
                    addPendingName();
                  }
                }}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={<SearchIcon />}
            disabled={multiNameQuery.isLoading || (selectedNames.length === 0 && !inputValue.trim())}
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
          <Alert severity="info">Type names, press Enter to add chips, then click Search.</Alert>
        )}
      </Stack>
    </Paper>
  );
}
