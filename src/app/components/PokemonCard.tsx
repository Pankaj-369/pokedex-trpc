"use client";

import Image from "next/image";
interface Pokemon {
  id: number;
  name: string;
  types: string;
  sprite: string;
}

export function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  return (
    <div style={{
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      padding: "16px",
      textAlign: "center",
      backgroundColor: "#f9f9f9",
      minWidth: "200px",
    }}>

      <Image
            src={pokemon.sprite}
            alt={pokemon.name}
            width={56}
            height={56}
            priority={false}
            placeholder="empty"
            style={{
              borderRadius: "4px",
            }}
          />
      <h3 style={{ margin: "12px 0 8px 0", fontSize: "18px" }}>
        {pokemon.name}
      </h3>
      <p style={{ margin: "4px 0", color: "#666", fontSize: "14px" }}>
        ID: {pokemon.id}
      </p>
      <p style={{ margin: "4px 0", color: "#666", fontSize: "14px" }}>
        Types: {pokemon.types}
      </p>
    </div>
  );
}