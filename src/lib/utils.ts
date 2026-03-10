export const POKEMON_TYPES = [
  "All Types",
  "grass",
  "poison",
  "fire",
  "flying",
  "water",
  "electric",
  "normal",
  "ground",
  "bug",
  "rock",
  "ghost",
  "steel",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
] as const;

export const PANEL_SX = {
  borderRadius: 3,
  p: { xs: 2.5, md: 3 },
  border: "1px solid",
  borderColor: "divider",
  transition: "box-shadow 200ms ease, transform 200ms ease",
  "&:hover": { boxShadow: 4, transform: "translateY(-2px)" },
};

export const ITEMS_PER_PAGE = 10;

export const getErrorMessage = (error: unknown): string => {
  if (!error) return "";
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return (error as Record<string, unknown>).message as string;
  }
  return "An error occurred. Please try again.";
};
