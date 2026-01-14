import { Component, signal, inject, Output, EventEmitter, OnDestroy } from '@angular/core';
import {  NgClass } from '@angular/common';
import { PlayerService } from '../../../services/playerService';
import { generaFrames } from '../../../services/frameService';

@Component({
  selector: 'app-vittima',
  templateUrl: './vittima.html',
  imports: [NgClass],
  styleUrl: './vittima.scss',
})
export class Vittima implements OnDestroy {

  // player service
  private playerService = inject(PlayerService);
  private playerSignal = this.playerService.getPlayer();

  // punteggio 
  punti: number = 0;
  mostraPunteggio = signal(false);

  // stati animazione
  isTakingHit = signal(false);

  // stato animazione iniziale
  animation = signal<'idle' | 'takingHit'>('idle');
  tipoEffetto = signal<'nuke' | 'flame' | 'hit' | null>(null);
  private previousAnimation: string = 'idle';
  frame = signal(0);

  // frames
  currentFrames: string[] = [];
  frames_idle = generaFrames('assets/images/Vittima/Idle/0_Valkyrie_Idle_', 17, 3);
  frames_damaged = generaFrames('assets/images/Vittima/Hurt/0_Valkyrie_Hurt_', 11, 3);

  // frames effetti
  currentFrames_hit: string[] | null = null;
  frames_hit = generaFrames('assets/images/Effetti/hit/', 13, 2);
  frames_nuke = generaFrames('assets/images/Effetti/nuke/', 26, 2);
  frame_effetti = signal(0);

  // intervallo animazione
  private animationInterval: any = null;

  // immagini
  images: HTMLImageElement[] = [];

  // event per notificare l’impatto
  @Output() colpita = new EventEmitter<[number, number, number, number]>();

  constructor() {

    // preload immagini
    [...this.frames_idle, ...this.frames_damaged, ...this.frames_hit, ...this.frames_nuke].forEach(src => {
      const img = new Image();
      img.src = src;
      this.images.push(img);
    });

    this.startAnimation();
  }

  startAnimation() {
    this.animationInterval = setInterval(() => {

      // determina animazione
      if (this.isTakingHit()) this.animation.set('takingHit');
      else                    this.animation.set('idle');

      // reset del frame se sono cambiati
      if (this.animation() !== this.previousAnimation) {
        this.frame.set(0);
        this.previousAnimation = this.animation();
      }

      // assegna frames
      switch (this.animation()) {
        case 'takingHit': this.currentFrames = this.frames_damaged; break;
        default:          this.currentFrames = this.frames_idle;
      }

      // avanza il frame
      this.frame.set((this.frame() + 1) % this.currentFrames.length);
      
      // fine takingHit
      if (this.animation() === 'takingHit' && this.frame() === this.frames_damaged.length - 1) {
        this.isTakingHit.set(false);
      }

    }, 55);
  }

  playHitAnimation(effetto: boolean) {
    this.isTakingHit.set(true);

    // calcolo punti e applicazione effetto
    if(effetto){ 

      //nuke
      if (Math.floor(Math.random() * 3) === 1) { 
        this.punti = Math.floor(Math.random() * 5000)+100;
        this.currentFrames_hit = this.frames_nuke; 
        this.tipoEffetto.set('nuke'); 
      } 
      else { 
        this.punti = Math.floor(Math.random() * 500)+100;
        this.currentFrames_hit = this.frames_hit; 
        this.tipoEffetto.set('flame');
      }
    } else {  
      this.punti = Math.floor(Math.random() * 50)+100;
      this.currentFrames_hit = this.frames_hit; 
      this.tipoEffetto.set('hit');
    }
    this.frame_effetti.set(0);

    // assegna punti
    if (this.playerSignal() !== null) {
      this.playerService.setHigherScore(this.punti);
      this.playerService.setScore(this.punti);
    }

    const hitInterval = setInterval(() => {

        // avanza il frame
        this.frame_effetti.set((this.frame_effetti() + 1) % this.currentFrames_hit!.length);

        if (this.frame_effetti() === this.currentFrames_hit!.length - 1) {
          clearInterval(hitInterval);
          this.currentFrames_hit = null;
          this.frame.set(0);
        }
      }, 45);
    
    //mostra punteggio
    this.mostraPunteggio.set(true);
    setTimeout(() => { this.mostraPunteggio.set(false); }, 700);
  }

  ngOnDestroy() {
    clearInterval(this.animationInterval);
    this.animationInterval = null;
  }
}
