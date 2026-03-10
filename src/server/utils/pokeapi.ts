type PokeApiPokemon = {
  id: number;
  name: string;
  types: Array<{ type: { name: string } }>;
  sprites?: {
    front_default?: string | null;
    other?: {
      ["official-artwork"]?: {
        front_default?: string | null;
      };
    };
  };
};

export type PokemonApiBasic = {
  id: number;
  name: string;
  types: string[];
  sprite: string;
};

export async function getPokemonBasicByName(name: string): Promise<PokemonApiBasic> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name.toLowerCase())}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`PokeAPI request failed with status ${response.status}`);
  }

  const data = (await response.json()) as PokeApiPokemon;

  return {
    id: data.id,
    name: data.name,
    types: data.types.map((entry) => entry.type.name),
    sprite:
      data.sprites?.other?.["official-artwork"]?.front_default ??
      data.sprites?.front_default ??
      "",
  };
}
