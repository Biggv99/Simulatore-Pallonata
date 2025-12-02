import { Injectable, signal } from '@angular/core';
import { UserData } from '../models/userModel';

@Injectable({ providedIn: 'root' })
export class PlayerService {

  player = signal<UserData | null>(null);
  
  // Impostare il player
  login(player: UserData) {
    this.player.set(player);
  }

  // Reseta il player
  logout() {
    this.player.set(null);
  }

  // Restituisce il player
  getPlayer() {
    return this.player;
  }

  // Aggiorna il player 
  private aggiorna(patch: Partial<UserData>) {
    const p = this.player();
    if (!p) return;
  
    const updated = { ...p, ...patch };
    this.player.set(updated);

    // aggiorna il localStorage
    const savedUsers = JSON.parse(localStorage.getItem('saved_users') || '[]') as UserData[];
    const updatedUsers = savedUsers.map(u => u.name === updated.name ? updated : u);
    localStorage.setItem('saved_users', JSON.stringify(updatedUsers));
  }

  // Aggiorna tempo di gioco
  setTime(tempo: number) {
    this.aggiorna({ tempoGioco: tempo });
  }

  // Aggiorna il punteggio massimo 
  setHigherScore(score: number) {
    const p = this.player();
    if (!p) return;

    if (score > p.punteggioMassimo) {
      this.aggiorna({ punteggioMassimo: score });
    }
  }

  // Aumenta il punteggio totale
  setScore(score: number) {
    const p = this.player();
    if (!p) return;
    
    this.aggiorna({ punteggioTotale: p.punteggioTotale + score });
  }
}

