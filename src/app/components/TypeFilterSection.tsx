"use client";

import { Box } from "@mui/material";

import {
  PokemonTypeSelection,
  type PokemonTypeSelectionProps,
} from "@/app/components/PokemonTypeSelection";

type TypeFilterSectionProps = {
  selectedType: string | undefined;
  setSelectedType: (type: string | undefined) => void;
};

export function TypeFilterSection({
  selectedType,
  setSelectedType,
}: TypeFilterSectionProps) {
  const typeSelectionProps: PokemonTypeSelectionProps = {
    selectedType,
    selectType: setSelectedType,
  };

  return (
    <Box>
      <PokemonTypeSelection {...typeSelectionProps} />
    </Box>
  );
}
