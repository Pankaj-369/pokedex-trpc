import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

type PokemonRow = {
  id: number;
  name: string;
  types: string;
  sprite: string;
};

const toPokemonDto = (pokemon: PokemonRow) => ({
  ...pokemon,
  types: pokemon.types.split(",").map((type) => type.trim()),
});

const toPokemonNameCase = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/(^|[\s-])[a-z]/g, (segment) => segment.toUpperCase());

const normalizeNames = (names: string[]) =>
  [...new Set(names.map(toPokemonNameCase).filter(Boolean))];

export const pokemonRouter = createTRPCRouter({
  getByName: publicProcedure
    .input(
      z.object({
        name: z.string().trim().min(1, "Pokemon name is required"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const pokemon = await ctx.db.pokemon.findUnique({
        where: {
          name: toPokemonNameCase(input.name),
        },
        select: {
          id: true,
          name: true,
          types: true,
          sprite: true,
        },
      });

      if (!pokemon) {
        throw new Error(`Pokemon "${input.name}" not found`);
      }

      return toPokemonDto(pokemon);
    }),

  getByNames: publicProcedure
    .input(
      z.object({
        names: z.array(z.string().min(1)),
      }),
    )
    .query(async ({ ctx, input }) => {
      const names = normalizeNames(input.names);

      if (names.length === 0) {
        return [];
      }

      const pokemon = await ctx.db.pokemon.findMany({
        where: {
          name: {
            in: names,
          },
        },
        select: {
          id: true,
          name: true,
          types: true,
          sprite: true,
        },
        orderBy: {
          id: "asc",
        },
      });

      return pokemon.map(toPokemonDto);
    }),

  list: publicProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        limit: z.number().int().min(1).max(100).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.limit;

      const [pokemon, total] = await Promise.all([
        ctx.db.pokemon.findMany({
          select: {
            id: true,
            name: true,
            types: true,
            sprite: true,
          },
          skip,
          take: input.limit,
          orderBy: {
            id: "asc",
          },
        }),
        ctx.db.pokemon.count(),
      ]);

      return {
        pokemon: pokemon.map(toPokemonDto),
        total,
        pageCount: Math.ceil(total / input.limit),
        currentPage: input.page,
      };
    }),

  getByType: publicProcedure
    .input(
      z.object({
        type: z.string().trim().optional(),
        page: z.number().int().positive().default(1),
        limit: z.number().int().min(1).max(100).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.limit;
      const normalizedType = input.type?.toLowerCase();
      const whereClause = normalizedType
        ? {
            types: {
              contains: normalizedType,
            },
          }
        : {};

      const [pokemon, total] = await Promise.all([
        ctx.db.pokemon.findMany({
          where: whereClause,
          select: {
            id: true,
            name: true,
            types: true,
            sprite: true,
          },
          skip,
          take: input.limit,
          orderBy: {
            id: "asc",
          },
        }),
        ctx.db.pokemon.count({
          where: whereClause,
        }),
      ]);

      return {
        pokemon: pokemon.map(toPokemonDto),
        total,
        pageCount: Math.ceil(total / input.limit),
        currentPage: input.page,
      };
    }),
});
