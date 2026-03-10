import { Prisma } from "@prisma/client";
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

const uniqueNormalizedNames = (names: string[]) =>
  [...new Set(names.map((name) => name.trim().toLowerCase()).filter(Boolean))];

export const pokemonRouter = createTRPCRouter({
  getByName: publicProcedure
    .input(
      z.object({
        name: z.string().trim().min(1, "Pokemon name is required"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.$queryRaw<PokemonRow[]>`
        SELECT id, name, types, sprite
        FROM Pokemon
        WHERE LOWER(name) = LOWER(${input.name})
        LIMIT 1
      `;
      const pokemon = result[0];

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
      const names = uniqueNormalizedNames(input.names);

      if (names.length === 0) {
        return [];
      }

      const pokemon = await ctx.db.$queryRaw<PokemonRow[]>(
        Prisma.sql`
          SELECT id, name, types, sprite
          FROM Pokemon
          WHERE LOWER(name) IN (${Prisma.join(names)})
          ORDER BY id ASC
        `,
      );

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
      const whereTypeSql = normalizedType
        ? Prisma.sql`WHERE LOWER(types) LIKE ${`%${normalizedType}%`}`
        : Prisma.empty;

      const [pokemonRows, totalRows] = await Promise.all([
        ctx.db.$queryRaw<PokemonRow[]>(
          Prisma.sql`
            SELECT id, name, types, sprite
            FROM Pokemon
            ${whereTypeSql}
            ORDER BY id ASC
            LIMIT ${input.limit}
            OFFSET ${skip}
          `,
        ),
        ctx.db.$queryRaw<Array<{ count: number | bigint }>>(
          Prisma.sql`
            SELECT COUNT(*) as count
            FROM Pokemon
            ${whereTypeSql}
          `,
        ),
      ]);

      const total = Number(totalRows[0]?.count ?? 0);

      return {
        pokemon: pokemonRows.map(toPokemonDto),
        total,
        pageCount: Math.ceil(total / input.limit),
        currentPage: input.page,
      };
    }),
});
