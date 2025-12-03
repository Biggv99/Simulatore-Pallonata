import { Component, signal, inject, OnDestroy } from '@angular/core';
import { keyboardService } from '../../../services/keyboardService';
import { FisicaService } from '../../../services/Fisica/fisicaService';
import { Oggetto } from '../../../services/Fisica/Oggetto';
import { generaFrames } from '../../../services/frameService';

@Component({
  selector: 'app-player',
  imports: [],
  templateUrl: './player.html',
  styleUrl: './player.scss',
})
export class Player implements OnDestroy {

  // fisica player
  private fisica: FisicaService = inject(FisicaService);
  playerOggetto: Oggetto;  

  // posizione 
  x = signal(0); 
  y = signal(0); 

  // movimento
  isMoving = signal(false);
  isJumping = signal(false);
  isKicking = signal(false);

  // frame
  frame = signal(0);
  frames_idle = generaFrames('assets/images/Player/Idle/0_Skeleton_Warrior_Idle_', 17, 3);
  frames_kicking = generaFrames('assets/images/Player/Kicking/0_Skeleton_Warrior_Kicking_', 11, 3);
  frames_jumping = generaFrames('assets/images/Player/Jump Start/0_Skeleton_Warrior_Jump Start_', 5, 3);
  frames_running = generaFrames('assets/images/Player/Running/0_Skeleton_Warrior_Running_', 11, 3);

  currentFrames: string[] = this.frames_idle;
  images: HTMLImageElement[] = [];

  // intervallo animazione
  private animationInterval: any = null;

  constructor() {

    // registra player negli oggetti di scena
    this.playerOggetto = new Oggetto(0, 0, 200, 200, true, "player");
    this.fisica.registraOggetto(this.playerOggetto);

    // pre-carica tutte le immagini
    [...this.frames_idle, ...this.frames_running, ...this.frames_jumping, ...this.frames_kicking].forEach(src => {
      const img = new Image();
      img.src = src;
      this.images.push(img);
    });

    // gestione keyboard
    const keyboard = inject(keyboardService);

    keyboard.onSpacePress(() => {
      if(!this.isJumping() && !this.isKicking()) {
        this.salta(300);
        this.playJumpingAnimation();
      }
    });

    keyboard.onShiftPress(() => {
      if(!this.isKicking() && !this.isJumping()) {
        this.playKickingAnimation();
      }
    });

    keyboard.onAPress(() => { this.muovi(-20, 0); this.isMoving.set(true); });
    keyboard.onDPress(() => { this.muovi(20, 0);  this.isMoving.set(true); });
    keyboard.onARelease(() => this.isMoving.set(false));
    keyboard.onDRelease(() => this.isMoving.set(false));

    // avvia animazione 
    this.startAnimation();
  }

  // Avvia animazione
  startAnimation() {
    this.animationInterval = setInterval(() => {

      // determina animazione
      if (this.isKicking()) this.currentFrames = this.frames_kicking;
      else if (this.isJumping()) this.currentFrames = this.frames_jumping;
      else if (this.isMoving()) this.currentFrames = this.frames_running;
      else this.currentFrames = this.frames_idle;

      // avanza frame
      this.frame.set((this.frame() + 1) % this.currentFrames.length);

      // controlla fine animazioni
      if(this.isKicking() && this.frame() === this.frames_kicking.length - 1) {
        this.isKicking.set(false);
        this.frame.set(0);
      }
      if(this.isJumping() && this.frame() === this.frames_jumping.length - 1) {
        this.isJumping.set(false);
        this.frame.set(0);
      }
    }, 65);
  }

  // Animazione kick
  playKickingAnimation() {
    this.isKicking.set(true);
    this.frame.set(0);
  }

  // Animazione jump
  playJumpingAnimation() {
    this.isJumping.set(true);
    this.frame.set(0);
  }

  // Muove
  muovi(dx: number, dy: number) {
    const x = this.x() + dx;
    const y = this.y() + dy;

    this.x.set(x);
    this.y.set(y);
    this.playerOggetto.setPosition(x, y);
  }

  // Salta
  salta(dy: number) {
    this.y.set(this.y() + dy);
    setTimeout(() => this.y.set(0), 500);
  }

  // Disattiva animazione
  ngOnDestroy() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }
}
