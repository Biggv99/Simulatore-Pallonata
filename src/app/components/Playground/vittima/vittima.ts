import { Component, signal, inject} from '@angular/core';
import { PlayerService } from '../../../services/playerService';
import { generaFrames } from '../../../services/frameService';

@Component({
  selector: 'app-vittima',
  templateUrl: './vittima.html',
  styleUrl: './vittima.scss',
})
export class Vittima {

  private playerService = inject(PlayerService);
  playerSignal = this.playerService.getPlayer();

  // indice del frame corrente
  frame_vittima = signal(0);
  frame_effetti = signal(0);

  frames_idle = generaFrames('assets/images/Vittima/Idle/0_Valkyrie_Idle_', 17, 3);
  frames_hit = generaFrames('assets/images/Vittima/Hurt/0_Valkyrie_Hurt_', 11, 3);
  frames_hitEffect = generaFrames('assets/images/Effetti/hit/', 13, 2);

  // array corrente da ciclare
  currentFrames_vittima: string[] = this.frames_idle;
  currentFrames_effetti: string[] | null = null;

  // immagini pre-caricate
  images_vittima: HTMLImageElement[] = [];
  images_effetti: HTMLImageElement[] = [];

  constructor() {
    // pre-carica tutte le immagini vittima
    [...this.frames_idle, ...this.frames_hit].forEach(src => {
      const img = new Image();
      img.src = src;
      this.images_vittima.push(img);
    });

    // pre-carica tutte le immagini effetti
    this.frames_hitEffect.forEach(src => {
      const img = new Image();
      img.src = src;
      this.images_effetti.push(img);
    });

    // avvia animazione idle
    this.startAnimation();
  }

  startAnimation() {
    setInterval(() => {
      this.frame_vittima.set((this.frame_vittima() + 1) % this.currentFrames_vittima.length);
    }, 50);
  }

  playIdleAnimation() {
    this.currentFrames_vittima = this.frames_idle;
    this.frame_vittima.set(0);
  }

  playHitAnimation(effetto: number) {

    // assegna dei punti random al giocatore 
    const punti = Math.floor(Math.random() * 200) * effetto; 
    console.log("Punti assegnati:", punti);

    // setta i punti al giocatore
    if (this.playerSignal() !== null) {

      this.playerService.setHigherScore(punti);
      this.playerService.setScore(punti);
    }
    
    // animazione vittima
    this.currentFrames_vittima = this.frames_hit;
    this.frame_vittima.set(0);

    // animazione effetto
    this.currentFrames_effetti = this.frames_hitEffect;
    this.frame_effetti.set(0);

    const effectInterval = setInterval(() => {
      if (this.currentFrames_effetti) {
        this.frame_effetti.set(
          (this.frame_effetti() + 1) % this.currentFrames_effetti.length
        );
      }
    }, 30);

    setTimeout(() => {
      clearInterval(effectInterval);
      this.currentFrames_effetti = null;
      this.playIdleAnimation();
    }, this.frames_hit.length * 50);
  }
}
