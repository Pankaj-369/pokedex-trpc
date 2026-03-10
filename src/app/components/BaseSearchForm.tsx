"use client";

import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, TextField } from "@mui/material";

type BaseSearchFormProps = {
  label: string;
  placeholder: string;
  helperText?: string;
  onSubmit: (value: string, parsedValues: string[]) => void;
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  buttonText: string;
  allowMultiple?: boolean;
  buttonColor?: "primary" | "secondary";
};

const parseMultipleValues = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export function BaseSearchForm({
  label,
  placeholder,
  helperText,
  onSubmit,
  value,
  onChange,
  isLoading,
  buttonText,
  allowMultiple = false,
  buttonColor = "primary",
}: BaseSearchFormProps) {
  const trimmedValue = value.trim();
  const parsedValues = allowMultiple ? parseMultipleValues(value) : [trimmedValue].filter(Boolean);

  return (
    <Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(trimmedValue, parsedValues);
      }}
      sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}
    >
      <TextField
        fullWidth
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        helperText={helperText}
      />
      <Button
        type="submit"
        variant="contained"
        startIcon={<SearchIcon />}
        disabled={parsedValues.length === 0 || isLoading}
        color={buttonColor}
        sx={{ "&:hover": { boxShadow: 6 } }}
      >
        {buttonText}
      </Button>
    </Box>
  );
}
