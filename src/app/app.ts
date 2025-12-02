import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Navbar } from "./components/navbar/navbar";
import { PokemonCheers } from './components/pokemon-cheers/pokemon-cheers';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, PokemonCheers], 
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('SimulatorePallonata'); 

  showPokemonCheers = signal(true);

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showPokemonCheers.set(event.url !== '/playground');
      });
  }
}
