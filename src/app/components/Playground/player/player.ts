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

  // stati animazione
  isMoving = signal(false);
  isJumping = signal(false);
  isKicking = signal(false);

  // stato animazione iniziale
  animation = signal<'idle' | 'moving' | 'jumping' | 'kicking'>('idle');
  private previousAnimation: string = 'idle';
  frame = signal(0);

  // frames
  currentFrames: string[] = [];
  frames_idle = generaFrames('assets/images/Player/Idle/0_Skeleton_Warrior_Idle_', 17, 3);
  frames_moving = generaFrames('assets/images/Player/Running/0_Skeleton_Warrior_Running_', 11, 3);
  frames_jumping = generaFrames('assets/images/Player/Jump Start/0_Skeleton_Warrior_Jump Start_', 5, 3);
  frames_kicking = generaFrames('assets/images/Player/Kicking/0_Skeleton_Warrior_Kicking_', 11, 3);

  // intervallo animazione
  private animationInterval: any = null;

  // immagini
  images: HTMLImageElement[] = [];
  
  constructor() {

    // registra player negli oggetti di scena
    this.playerOggetto = new Oggetto(0, 0, 200, 200, true, "player");
    this.fisica.registraOggetto(this.playerOggetto);

    // preload immagini
    [...this.frames_idle, ...this.frames_moving, ...this.frames_jumping, ...this.frames_kicking].forEach(src => {
      const img = new Image();
      img.src = src;
      this.images.push(img);
    });

    // keyboard
    const keyboard: keyboardService = inject(keyboardService);

    keyboard.onSpacePress(() => {
      if (!this.isJumping() && !this.isKicking()) {
        this.playJumpingAnimation(100);
      }
    });

    keyboard.onShiftPress(() => {
      if (!this.isKicking() && !this.isJumping()) {
        this.playKickingAnimation();
      }
    });

    keyboard.onAPress(() => this.playMovingAnimation(-15, 0));
    keyboard.onDPress(() => this.playMovingAnimation(15, 0));
    keyboard.onARelease(() => { this.isMoving.set(false); });
    keyboard.onDRelease(() => { this.isMoving.set(false); });

    this.startAnimation();
  }

  startAnimation() {
    this.animationInterval = setInterval(() => {

      // determina animazione
      if (this.isJumping())      this.animation.set('jumping');
      else if (this.isKicking()) this.animation.set('kicking');
      else if (this.isMoving())  this.animation.set('moving');
      else                       this.animation.set('idle');

      // reset del frame se sono cambiati
      if (this.animation() !== this.previousAnimation) {
        this.frame.set(0);
        this.previousAnimation = this.animation();
      }

      // assegna frames
      switch (this.animation()) {
        case 'moving':  this.currentFrames = this.frames_moving; break;
        case 'jumping': this.currentFrames = this.frames_jumping; break;
        case 'kicking': this.currentFrames = this.frames_kicking; break;
        default:        this.currentFrames = this.frames_idle;
      }

      // avanza il frame
      this.frame.set((this.frame() + 1) % this.currentFrames.length);

      // fine jumping
      if (this.animation() === 'jumping' && this.frame() === this.frames_jumping.length - 1) {
        this.isJumping.set(false);
      }

      // fine kicking
      if (this.animation() === 'kicking' && this.frame() === this.frames_kicking.length - 1) {
        this.isKicking.set(false);
      }

    }, 55);
  }

  playMovingAnimation(dx: number, dy: number) {
    const x = this.x() + dx;
    const y = this.y() + dy;

    this.x.set(x);
    this.y.set(y);
    this.playerOggetto.setPosition(x, y);

    this.isMoving.set(true);
  }

  playJumpingAnimation(dy: number) {
    this.y.set(this.y() + dy);
    setTimeout(() => this.y.set(0), 500);

    this.isJumping.set(true);
  }

  playKickingAnimation() {
    this.isKicking.set(true);
  }

  ngOnDestroy() {
    clearInterval(this.animationInterval);
    this.animationInterval = null;
  }
}
