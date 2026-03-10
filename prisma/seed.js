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
      { name: "Pidgeot", types: "normal,flying", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/18.png" },
      { name: "Pikachu", types: "electric", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" },
      { name: "Raichu", types: "electric", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png" },
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