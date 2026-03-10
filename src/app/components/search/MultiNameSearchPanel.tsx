"use client";

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
import { useMemo, useState } from "react";

import { PokemonTable } from "@/app/components/PokemonTable";
import { CACHE_CONFIG } from "@/lib/cache-config";
import { PANEL_SX, getErrorMessage } from "@/lib/utils";
import { trpc } from "@/trpc/client";

const splitNames = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const dedupeNames = (names: string[]) => {
  const seen = new Set<string>();
  return names.filter((name) => {
    const key = name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const normalizeAutocompleteValues = (values: string[]) =>
  dedupeNames(values.flatMap((value) => splitNames(value)));

export function MultiNameSearchPanel() {
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const queryNames = useMemo(() => dedupeNames(selectedNames), [selectedNames]);

  const multiNameQuery = trpc.pokemon.getByNames.useQuery(
    { names: queryNames },
    { ...CACHE_CONFIG.search, enabled: queryNames.length > 0, retry: false },
  );

  const commitInputAsChips = () => {
    const parsed = splitNames(inputValue);
    if (parsed.length === 0) return;
    setSelectedNames((prev) => dedupeNames([...prev, ...parsed]));
    setInputValue("");
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
            commitInputAsChips();
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
            onChange={(_, nextValues) => setSelectedNames(normalizeAutocompleteValues(nextValues))}
            filterOptions={(options) => options}
            sx={{ flex: 1, minWidth: 300 }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} key={`${option}-${index}`} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Type Pokemon names and press Enter"
                placeholder="pikachu"
                helperText="Each Enter adds chips and triggers search automatically."
                onKeyDown={(event) => {
                  if (event.key === "Enter" && inputValue.trim()) {
                    event.preventDefault();
                    commitInputAsChips();
                  }
                }}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!inputValue.trim()}
            sx={{
              backgroundColor: "primary.main",
              "&:hover": { backgroundColor: "primary.dark", boxShadow: 6 },
            }}
          >
            Search
          </Button>
        </Box>

        {queryNames.length > 0 ? (
          <PokemonTable
            pokemon={multiNameQuery.data ?? []}
            isLoading={multiNameQuery.isLoading}
            error={multiNameQuery.error ? new Error(getErrorMessage(multiNameQuery.error)) : null}
          />
        ) : (
          <Alert severity="info">Type a name, press Enter, and results will load automatically.</Alert>
        )}
      </Stack>
    </Paper>
  );
}
