import { QueryClient } from "@tanstack/react-query";

import { CACHE_CONFIG } from "@/lib/cache-config";

export const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: CACHE_CONFIG.default,
    },
  });
