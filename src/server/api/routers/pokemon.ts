import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const pokemonRouter = createTRPCRouter({

  getByName: publicProcedure
    .input(
      z.object({
        name: z.string().trim().min(1, "Pokemon name is required"),
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.$queryRaw<
        Array<{
          id: number;
          name: string;
          types: string;
          sprite: string;
        }>
      >`
        SELECT id, name, types, sprite
        FROM "Pokemon"
        WHERE LOWER(name) = LOWER(${input.name})
        LIMIT 1
      `;
      const pokemon = result[0];

      if (!pokemon) {
        throw new Error(`Pokemon "${input.name}" not found`);
      }

      return {
        ...pokemon,
        types: pokemon.types.split(",").map((t) => t.trim()),
      };
    }),

  getByNames: publicProcedure
    .input(
      z.object({
        names: z.array(z.string().min(1)),
      })
    )
    .query(async ({ ctx, input }) => {
      const pokemon = await ctx.db.pokemon.findMany({
  where: {
    OR: input.names.map((name) => ({
      name: {
        equals: name,
        mode: "insensitive",
      },
    })),
  },
  select: {
    id: true,
    name: true,
    types: true,
    sprite: true,
  },
});

      return pokemon.map((p) => ({
        ...p,
        types: p.types.split(",").map((t) => t.trim()),
      }));
    }),

  list: publicProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        limit: z.number().int().min(1).max(100).default(10),
      })
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
        pokemon: pokemon.map((p) => ({
          ...p,
          types: p.types.split(",").map((t) => t.trim()),
        })),
        total,
        pageCount: Math.ceil(total / input.limit),
        currentPage: input.page,
      };
    }),

  getByType: publicProcedure
    .input(
      z.object({
        type: z.string().optional(),
        page: z.number().int().positive().default(1),
        limit: z.number().int().min(1).max(100).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.limit;

      const whereClause = input.type
        ? {
          types: {
            contains: input.type,
            mode: "insensitive",
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
        pokemon: pokemon.map((p) => ({
          ...p,
          types: p.types.split(",").map((t) => t.trim()),
        })),
        total,
        pageCount: Math.ceil(total / input.limit),
        currentPage: input.page,
      };
    }),
});
