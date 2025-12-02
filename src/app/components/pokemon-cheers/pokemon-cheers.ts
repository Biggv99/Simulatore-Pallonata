import { Component, inject, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PokemonService } from '../../servives/pokemonService'; 
import { PokemonData } from '../../models/pokemonModel';
import { PokemonCard } from '../pokemon-card/pokemon-card';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-pokemon-cheers',
  standalone: true,
  imports: [PokemonCard],
  templateUrl: './pokemon-cheers.html',
  styleUrl: './pokemon-cheers.scss',
})
export class PokemonCheers {

  private pokemonService = inject(PokemonService);
  private router = inject(Router); 
  isLoading = signal(false); 
  randomPokemon = signal<PokemonData[]>([]);

  constructor() {
    // ricarica sempre i Pokémon quando navighi verso questa route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.loadRandomPokemon());
  }

  ngOnInit() {
    this.loadRandomPokemon();
  }

  private async loadRandomPokemon() { 
    this.isLoading.set(true); 
    const pokes = await this.pokemonService.getRandomPokemon(10);
    this.isLoading.set(false); 
    this.randomPokemon.set(pokes); 
  }

  /* Per vedere la rotellina
  private async loadRandomPokemon() {
    this.isLoading.set(true); 
    await new Promise(resolve => setTimeout(resolve, 5000));
    const pokes = await this.pokemonService.getRandomPokemon();
    this.isLoading.set(false); 
    this.randomPokemon.set(pokes);
  }
  */
}

