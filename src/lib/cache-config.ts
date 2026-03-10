export const CACHE_CONFIG = {
  default: {
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  },
  search: {
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  },
  typeFilter: {
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  },
} as const;
