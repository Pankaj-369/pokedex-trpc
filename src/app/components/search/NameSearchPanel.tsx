"use client";

import {
  Alert,
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { BaseSearchForm } from "@/app/components/BaseSearchForm";
import { PokemonRow } from "@/app/components/PokemonRow";
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

        <BaseSearchForm
          label="Type a Pokemon name..."
          placeholder="Type a Pokemon name..."
          value={nameInput}
          onChange={setNameInput}
          onSubmit={(value) => setSubmittedName(value)}
          isLoading={nameQuery.isLoading}
          buttonText="Search"
          buttonColor="secondary"
        />

        {submittedName ? (
          nameQuery.error ? (
            <Alert severity="error">{getErrorMessage(nameQuery.error)}</Alert>
          ) : nameQuery.isLoading ? (
            <PokemonTable pokemon={[]} isLoading error={null} />
          ) : nameQuery.data ? (
            <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
              <Table>
                <TableHead sx={{ backgroundColor: "action.hover" }}>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: 700, width: "10%" }}>
                      ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, width: "40%" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, width: "50%" }}>Types</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <PokemonRow pokemon={nameQuery.data} />
                </TableBody>
              </Table>
            </Box>
          ) : (
            <Alert severity="info">No Pokemon found.</Alert>
          )
        ) : (
          <Alert severity="info">Type a name and click Search to see a result.</Alert>
        )}
      </Stack>
    </Paper>
  );
}
