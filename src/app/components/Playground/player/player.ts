import { Component, signal, inject } from '@angular/core';
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
export class Player {

  // keyboard
  private keyboard: keyboardService = inject(keyboardService);

  // fisica oggetto scena
  private fisica: FisicaService = inject(FisicaService);
  playerOggetto: Oggetto;  

  // posizione 
  x = signal(0); 
  y = signal(0); 

  // movimento
  isMoving = signal(false);
  isJumping = signal(false);
  isKicking = signal(false);

  // indice del frame corrente
  frame = signal(0);
  frames_idle = generaFrames('assets/images/Player/Idle/0_Skeleton_Warrior_Idle_', 17, 3);
  frames_kicking = generaFrames('assets/images/Player/Kicking/0_Skeleton_Warrior_Kicking_', 11, 3);
  frames_jumping = generaFrames('assets/images/Player/Jump Start/0_Skeleton_Warrior_Jump Start_', 5, 3);
  frames_running = generaFrames('assets/images/Player/Running/0_Skeleton_Warrior_Running_', 11, 3);
  
  // array corrente da ciclare
  currentFrames: string[] = this.frames_idle;

  // immagini pre-caricate
  images: HTMLImageElement[] = [];

  constructor() {

    // registra il player nell'array di oggetti di scena
    this.playerOggetto = new Oggetto(0, 0, 200, 200, true, "player");
    this.fisica.registraOggetto(this.playerOggetto);

    // pre-carica tutte le immagini
    [...this.frames_idle, ...this.frames_running, ...this.frames_jumping, ...this.frames_kicking].forEach(src => {
      const img = new Image();
      img.src = src;
      this.images.push(img);
    });

    // ascolta la barra spaziatrice dal servizio
    this.keyboard.onSpacePress(() => {
      if(!this.isJumping() && !this.isKicking()) {
        this.salta(300);
        this.playJumpingAnimation();
      }
    });

    // sinistra premuto
    this.keyboard.onAPress(() => {
      this.muovi(-20, 0);
      this.isMoving.set(true);
    });

    // destra premuto
    this.keyboard.onDPress(() => {
      this.muovi(20, 0);
      this.isMoving.set(true);
    });

    // sinistra rilasciato
    this.keyboard.onARelease(() => {
      this.isMoving.set(false);
    });

    // destra rilasciato
    this.keyboard.onDRelease(() => {
      this.isMoving.set(false);
    });

    // tiro
    this.keyboard.onShiftPress(() => {
      if(!this.isKicking() && !this.isJumping()) {
        this.playKickingAnimation();
      }
    });

    // avvia animazione unica
    this.startAnimation();
  }

  // ciclo unico dei frame
  startAnimation() {
    setInterval(() => {

      // logica animazioni 
      if(this.isKicking()) {
        this.currentFrames = this.frames_kicking;
      } else if(this.isJumping()) {
        this.currentFrames = this.frames_jumping;
      } else if(this.isMoving()) {
        this.currentFrames = this.frames_running;
      } else {
        this.currentFrames = this.frames_idle;
      }

      // aggiorna frame
      this.frame.set((this.frame() + 1) % this.currentFrames.length);

      // controlla fine animazioni a durata fissa
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

  // animazioni con stato
  playKickingAnimation() {
    this.isKicking.set(true);
    this.frame.set(0);
  }

  playJumpingAnimation() {
    this.isJumping.set(true);
    this.frame.set(0);
  }

  // muovi giocatore
  muovi(dx: number, dy: number) {
    const x = this.x() + dx;
    const y = this.y() + dy;

    this.x.set(x);
    this.y.set(y);
    this.playerOggetto.setPosition(x, y);
  }

  // salta giocatore
  salta(dy: number) {
    this.y.set(this.y() + dy);
    setTimeout(() => this.y.set(0), 500);
  }
}
