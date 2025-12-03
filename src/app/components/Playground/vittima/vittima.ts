import { Component, signal, inject, OnDestroy } from '@angular/core';
import { PlayerService } from '../../../services/playerService';
import { generaFrames } from '../../../services/frameService';

@Component({
  selector: 'app-vittima',
  templateUrl: './vittima.html',
  styleUrl: './vittima.scss',
})
export class Vittima implements OnDestroy {

  // player service
  private playerService = inject(PlayerService);
  private playerSignal = this.playerService.getPlayer();

  // frame
  frame_vittima = signal(0);
  frame_effetti = signal(0);

  frames_idle = generaFrames('assets/images/Vittima/Idle/0_Valkyrie_Idle_', 17, 3);
  frames_hit = generaFrames('assets/images/Vittima/Hurt/0_Valkyrie_Hurt_', 11, 3);
  frames_hitEffect = generaFrames('assets/images/Effetti/hit/', 13, 2);

  currentFrames_vittima: string[] = this.frames_idle;
  currentFrames_effetti: string[] | null = null;

  images_vittima: HTMLImageElement[] = [];
  images_effetti: HTMLImageElement[] = [];

  // intervallo animazione
  private animationInterval: any = null;

  constructor() {

    [...this.frames_idle, ...this.frames_hit].forEach(src => {
      const img = new Image();
      img.src = src;
      this.images_vittima.push(img);
    });

    this.frames_hitEffect.forEach(src => {
      const img = new Image();
      img.src = src;
      this.images_effetti.push(img);
    });

    // avvia animazione
    this.startAnimation();
  }

  // Avvia animazione
  startAnimation() {
    this.animationInterval = setInterval(() => {

      // vittima
      this.frame_vittima.set( (this.frame_vittima() + 1) % this.currentFrames_vittima.length );

      if ( (this.currentFrames_vittima === this.frames_hit) && (this.frame_vittima() === this.frames_hit.length - 1) ) {
        this.currentFrames_vittima = this.frames_idle;
        this.frame_vittima.set(0);
      }

      // effetto
      if (this.currentFrames_effetti) {
        this.frame_effetti.set( (this.frame_effetti() + 1) % this.currentFrames_effetti.length );

        if (this.frame_effetti() === this.currentFrames_effetti.length - 1) {
          this.currentFrames_effetti = null;
          this.frame_effetti.set(0);
        }
      }
    }, 50);
  }

  playHitAnimation(effetto: number) {

    // assegna punti
    if (this.playerSignal() !== null) {
      const punti = Math.floor(Math.random() * 200) * effetto;
      this.playerService.setHigherScore(punti);
      this.playerService.setScore(punti);
    }

    // anima vittima
    this.currentFrames_vittima = this.frames_hit;
    this.frame_vittima.set(0);

    // anima effetto
    this.currentFrames_effetti = this.frames_hitEffect;
    this.frame_effetti.set(0);
  }

  // Disattiva animazione
  ngOnDestroy() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }
}
