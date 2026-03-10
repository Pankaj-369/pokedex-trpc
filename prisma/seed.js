import  { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.pokemon.deleteMany();

  await prisma.pokemon.createMany({
     data: [
    { name: "Bulbasaur", types: "grass,poison", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
    { name: "Ivysaur", types: "grass,poison", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png" },
    { name: "Venusaur", types: "grass,poison", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png" },

    { name: "Charmander", types: "fire", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
    { name: "Charmeleon", types: "fire", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png" },
    { name: "Charizard", types: "fire,flying", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png" },

    { name: "Squirtle", types: "water", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" },
    { name: "Wartortle", types: "water", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png" },
    { name: "Blastoise", types: "water", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png" },

    { name: "Butterfree", types: "bug,flying", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/12.png" },

    { name: "Pidgeot", types: "normal,flying", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/18.png" },

    { name: "Pikachu", types: "electric", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" },
    { name: "Raichu", types: "electric", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png" },

    { name: "Sandslash", types: "ground", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/28.png" },

    { name: "Clefable", types: "fairy", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/36.png" },

    { name: "Golbat", types: "poison,flying", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/42.png" },

    { name: "Alakazam", types: "psychic", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png" },

    { name: "Machamp", types: "fighting", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/68.png" },

    { name: "Golem", types: "rock,ground", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/76.png" },

    { name: "Magneton", types: "electric,steel", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/82.png" },

    { name: "Gengar", types: "ghost,poison", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png" },

    { name: "Onix", types: "rock,ground", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png" },

    { name: "Lapras", types: "water,ice", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png" },

    { name: "Dragonite", types: "dragon,flying", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png" },
  ],
  });

  console.log("Seeded 12 pokemon!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });