"use client";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import { POKEMON_TYPES } from "@/lib/utils";

export type PokemonTypeSelectionProps = {
  selectedType: string | undefined;
  selectType: (type: string | undefined) => void;
};

export function PokemonTypeSelection({
  selectedType,
  selectType,
}: PokemonTypeSelectionProps) {
  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    selectType(value === "All Types" ? undefined : value);
  };

  return (
    <Box sx={{ minWidth: 200, marginBottom: 3 }}>
      <FormControl fullWidth>
        <InputLabel>Filter by Type</InputLabel>
        <Select
          value={selectedType || "All Types"}
          label="Filter by Type"
          onChange={handleChange}
        >
          {POKEMON_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
