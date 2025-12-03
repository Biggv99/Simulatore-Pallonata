import { Injectable } from '@angular/core';
import { PokemonData } from '../models/pokemonModel';

@Injectable({ providedIn: 'root' })
export class PokemonService {

    private data: PokemonData[] = []; 

    // Recupera i primi 151 Pokémon
    async getAllPokemon(): Promise<PokemonData[]> {
        if (this.data.length > 0) return this.data;

        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await res.json();
        this.data = data.results;
        return this.data; 
    }

    // Restituisce Pokémon casuali senza duplicati
    async getRandomPokemon(count: number): Promise<PokemonData[]> {

        const allPokemon = await this.getAllPokemon();

        // seleziona indici casuali (quanto è count) senza duplicati
        const selected = new Set<number>();
        while (selected.size < count) {
            selected.add(Math.floor(Math.random() * allPokemon.length));
        }

        const chosen = [...selected].map(i => allPokemon[i]);

        // recupera i dettagli dei Pokémon selezionati
        const fullData = await Promise.all(
            chosen.map(async p => {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.name}`);
                const data = await res.json();

                return {
                    name: data.name,
                    url: data.sprites.front_default
                };
            })
        );

        return fullData;
    }
}
