"use client";

import { Stack } from "@mui/material";
import { useState } from "react";

import { PokemonTypeList } from "@/app/components/PokemonTypeList";
import { TypeFilterSection } from "@/app/components/TypeFilterSection";
import { ITEMS_PER_PAGE } from "@/lib/utils";

export function FilterablePokedexTable() {
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Stack spacing={2} sx={{ px: 3, pb: 3 }}>
      <TypeFilterSection
        selectedType={selectedType}
        setSelectedType={(type) => {
          setSelectedType(type);
          setCurrentPage(1);
        }}
      />

      <PokemonTypeList
        selectedType={selectedType}
        page={currentPage}
        pageSize={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </Stack>
  );
}
