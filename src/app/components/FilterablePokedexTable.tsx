"use client";

import { useEffect, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Container,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { trpc } from "@/trpc/client";
import { PokemonTable } from "./PokemonTable";
import {
  PokemonTypeSelection,
  type PokemonTypeSelectionProps,
} from "./PokemonTypeSelection";

const ITEMS_PER_PAGE = 10;

type FilterablePokedexTableProps = {
  typeOnly?: boolean;
};

export function FilterablePokedexTable({ typeOnly = false }: FilterablePokedexTableProps) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (typeOnly) {
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, typeOnly]);

  const {
    data: typeFilterData,
    isLoading: typeFilterLoading,
    error: typeFilterError,
  } = trpc.pokemon.getByType.useQuery(
    {
      type: selectedType,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    },
    {
      enabled: typeOnly || debouncedSearch.length === 0,
      staleTime: 5 * 60 * 1000,
      placeholderData: (previousData) => previousData,
    },
  );

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = trpc.pokemon.getByName.useQuery(
    { name: debouncedSearch },
    {
      enabled: !typeOnly && debouncedSearch.length > 0,
      retry: false,
      staleTime: 10 * 60 * 1000,
    },
  );

  const displayData = useMemo(() => {
    if (!typeOnly && debouncedSearch) {
      return {
        pokemon: searchData ? [searchData] : [],
        pageCount: 1,
        currentPage: 1,
      };
    }

    return {
      pokemon: typeFilterData?.pokemon ?? [],
      pageCount: typeFilterData?.pageCount ?? 1,
      currentPage: typeFilterData?.currentPage ?? 1,
    };
  }, [debouncedSearch, searchData, typeFilterData, typeOnly]);

  const getErrorMessage = (error: unknown): string => {
    if (!error) return "";
    if (error instanceof Error) return error.message;
    if (typeof error === "object" && error !== null && "message" in error) {
      return (error as Record<string, unknown>).message as string;
    }
    return "An error occurred. Please try again.";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  const typeSelectionProps: PokemonTypeSelectionProps = {
    selectedType,
    selectType: (type) => {
      setSelectedType(type);
      setCurrentPage(1);
    },
  };

  const isSearching = !typeOnly && debouncedSearch.length > 0;
  const isLoading = isSearching ? searchLoading : typeFilterLoading;
  const errorMessage = getErrorMessage(isSearching ? searchError : typeFilterError);

  return (
    <Container maxWidth={typeOnly ? "xl" : "lg"} sx={{ py: typeOnly ? 0 : 4 }}>
      {!typeOnly && (
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 4,
            fontWeight: 800,
            color: "text.primary",
            opacity: 0,
            animation: "fadeUp 500ms ease forwards",
          }}
        >
          Pokedex Explorer
        </Typography>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: "1px solid #e9edf5",
          transition: "box-shadow 200ms ease, transform 200ms ease",
          "&:hover": { boxShadow: 4, transform: "translateY(-2px)" },
        }}
      >
        <Stack spacing={2}>
          {!typeOnly && (
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{ display: "flex", gap: 2, alignItems: "flex-end", flexWrap: "wrap" }}
            >
              <TextField
                label="Search Pokemon by name"
                variant="outlined"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="e.g., Bulbasaur"
                sx={{ flex: 1, minWidth: 260 }}
              />
              {searchInput && (
                <Button variant="outlined" onClick={handleClearSearch} disabled={isLoading}>
                  Clear
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                startIcon={<SearchIcon />}
                disabled={isLoading || !searchInput.trim()}
                sx={{
                  backgroundColor: "#e63946",
                  "&:hover": {
                    backgroundColor: "#cc2f3a",
                    transform: "translateY(-1px)",
                    boxShadow: 6,
                  },
                }}
              >
                Search
              </Button>
            </Box>
          )}

          <Box>
            <PokemonTypeSelection {...typeSelectionProps} />
          </Box>
        </Stack>
      </Paper>

      {!typeOnly && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {debouncedSearch
              ? `Search results for "${debouncedSearch}"`
              : selectedType
                ? `Showing ${selectedType}-type Pokemon`
                : "Showing all Pokemon"}
          </Typography>
        </Box>
      )}

      <PokemonTable
        pokemon={displayData.pokemon}
        isLoading={isLoading}
        error={errorMessage ? new Error(errorMessage) : null}
      />

      {displayData.pageCount > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={displayData.pageCount}
            page={displayData.currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            disabled={isLoading}
          />
        </Box>
      )}
    </Container>
  );
}
