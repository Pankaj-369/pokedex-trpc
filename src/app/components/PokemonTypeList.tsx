"use client";

import { Box, Pagination } from "@mui/material";

import { getErrorMessage } from "@/lib/utils";
import { CACHE_CONFIG } from "@/lib/cache-config";
import { trpc } from "@/trpc/client";
import { PokemonTable } from "@/app/components/PokemonTable";

type PokemonTypeListProps = {
  selectedType: string | undefined;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export function PokemonTypeList({
  selectedType,
  page,
  pageSize,
  onPageChange,
}: PokemonTypeListProps) {
  const typeFilterQuery = trpc.pokemon.getByType.useQuery(
    {
      type: selectedType,
      page,
      limit: pageSize,
    },
    {
      ...CACHE_CONFIG.typeFilter,
      placeholderData: (previousData) => previousData,
    },
  );

  const pokemon = typeFilterQuery.data?.pokemon ?? [];
  const pageCount = typeFilterQuery.data?.pageCount ?? 1;
  const currentPage = typeFilterQuery.data?.currentPage ?? page;
  const errorMessage = getErrorMessage(typeFilterQuery.error);

  return (
    <>
      <PokemonTable
        pokemon={pokemon}
        isLoading={typeFilterQuery.isLoading}
        error={errorMessage ? new Error(errorMessage) : null}
      />

      {pageCount > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={(_, nextPage) => onPageChange(nextPage)}
            color="primary"
            disabled={typeFilterQuery.isLoading}
          />
        </Box>
      )}
    </>
  );
}
