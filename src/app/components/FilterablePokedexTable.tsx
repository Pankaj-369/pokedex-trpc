"use client";

import { useState, useMemo } from "react";
import {
    Container,
    Box,
    TextField,
    Button,
    Stack,
    Paper,
    Typography,
    Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { trpc } from "@/trpc/client";
import { PokemonTable } from "./PokemonTable";
import {
    PokemonTypeSelection,
    type PokemonTypeSelectionProps,
} from "./PokemonTypeSelection";

const ITEMS_PER_PAGE = 10;

export function FilterablePokedexTable() {
    const [searchInput, setSearchInput] = useState("");
    const [selectedType, setSelectedType] = useState<string | undefined>(
        undefined
    );
    const [currentPage, setCurrentPage] = useState(1);

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
            staleTime: 5 * 60 * 1000,
        }
    );

    const {
        data: searchData,
        isLoading: searchLoading,
        error: searchError,
    } = trpc.pokemon.getByName.useQuery(
        { name: searchInput },
        {
            enabled: searchInput.length > 0,
            staleTime: 5 * 60 * 1000,
        }
    );

    const displayData = useMemo(() => {
        if (searchInput && searchData) {
            return {
                pokemon: [searchData],
                pageCount: 1,
                currentPage: 1,
            };
        }

        return {
            pokemon: typeFilterData?.pokemon || [],
            pageCount: typeFilterData?.pageCount || 1,
            currentPage: typeFilterData?.currentPage || 1,
        };
    }, [searchInput, searchData, typeFilterData]);

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
    };

    const handleClearSearch = () => {
        setSearchInput("");
        setCurrentPage(1);
    };

    const typeSelectionProps: PokemonTypeSelectionProps = {
        selectedType,
        selectType: (type) => {
            setSelectedType(type);
            setCurrentPage(1);
        },
    };

    const isLoading = typeFilterLoading || searchLoading;
    const errorMessage = getErrorMessage(typeFilterError || searchError); // ← CHANGED

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
                Pokédex Explorer
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
                            disabled={isLoading}
                        />
                        {searchInput && (
                            <Button
                                variant="outlined"
                                onClick={handleClearSearch}
                                disabled={isLoading}
                            >
                                Clear
                            </Button>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SearchIcon />}
                            disabled={isLoading || !searchInput}
                        >
                            Search
                        </Button>
                    </Box>

                    {!searchInput && (
                        <Box>
                            <PokemonTypeSelection {...typeSelectionProps} />
                        </Box>
                    )}
                </Stack>
            </Paper>

            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="textSecondary">
                    {searchInput
                        ? `Search results for "${searchInput}"`
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

            {!searchInput && displayData.pageCount > 1 && (
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