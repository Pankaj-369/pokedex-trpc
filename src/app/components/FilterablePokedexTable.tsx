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

export function FilterablePokedexTable() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

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
      enabled: debouncedSearch.length === 0,
      staleTime: 5 * 60 * 1000,
    },
  );

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = trpc.pokemon.getByName.useQuery(
    { name: debouncedSearch },
    {
      enabled: debouncedSearch.length > 0,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  );

  const displayData = useMemo(() => {
    if (debouncedSearch) {
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
  }, [debouncedSearch, searchData, typeFilterData]);

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

  const isSearching = debouncedSearch.length > 0;
  const isLoading = isSearching ? searchLoading : typeFilterLoading;
  const errorMessage = getErrorMessage(isSearching ? searchError : typeFilterError);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: 4,
          fontWeight: 700,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Pokedex Explorer
      </Typography>

      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Stack spacing={2}>
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}
          >
            <TextField
              label="Search Pokemon by name"
              variant="outlined"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g., Bulbasaur"
              sx={{ flex: 1 }}
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
            >
              Search
            </Button>
          </Box>

          {!debouncedSearch && (
            <Box>
              <PokemonTypeSelection {...typeSelectionProps} />
            </Box>
          )}
        </Stack>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {debouncedSearch
            ? `Search results for "${debouncedSearch}"`
            : selectedType
              ? `Showing ${selectedType}-type Pokemon`
              : "Showing all Pokemon"}
        </Typography>
      </Box>

      <PokemonTable
        pokemon={displayData.pokemon}
        isLoading={isLoading}
        error={errorMessage ? new Error(errorMessage) : null}
      />

      {!debouncedSearch && displayData.pageCount > 1 && (
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
