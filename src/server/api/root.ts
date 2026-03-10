import { pokemonRouter } from "@/server/api/routers/pokemon";
import { createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  pokemon: pokemonRouter,
});

export type AppRouter = typeof appRouter;
