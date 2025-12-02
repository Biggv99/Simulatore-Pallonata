import { Component, Input, OnInit, signal } from '@angular/core';
import { PokemonData } from '../../models/pokemonModel';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.scss',
})
export class PokemonCard implements OnInit {
  @Input() pokemon!: PokemonData;

  isJumping = signal(false);

  ngOnInit() {
    this.startJump(Math.random() * 2000 + 1000); 
  }

  startJump(initialDelay?: number) {
    const randomDelay = initialDelay ?? (Math.random() * 4000 + 3000);

    setTimeout(() => {
      this.isJumping.set(true);

      setTimeout(() => {
        this.isJumping.set(false);
        this.startJump();
      }, 400);

    }, randomDelay);
  }
}

