import { Component, signal, inject } from '@angular/core';
import { keyboardService } from '../../../servives/keyboardService';
import { FisicaService } from '../../../servives/Fisica/fisicaService';
import { Oggetto } from '../../../servives/Fisica/Oggetto';

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
  left_fisica = 0;
  bottom_fisica = 0;
  larghezza_fisica = 200;
  altezza_fisica = 200;
  playerOggetto: Oggetto;

  // posizione 
  bottom = signal(0); 
  left = signal(0); 

  // movimento
  isMoving = signal(false);
  isJumping = signal(false);
  isKicking = signal(false);

  // indice del frame corrente
  frame = signal(0);

  // array dei frame (da compilare tu)
  frames_idle: string[] = [
    'assets/images/Player/Idle/0_Skeleton_Warrior_Idle_000.png',
    'assets/images/Player/Idle/0_Skeleton_Warrior_Idle_001.png',
    'assets/images/Player/Idle/0_Skeleton_Warrior_Idle_002.png',
    'assets/images/Player/Idle/0_Skeleton_Warrior_Idle_003.png',
    'assets/images/Player/Idle/0_Skeleton_Warrior_Idle_004.png',
    'assets/images/Player/Idle/0_Skeleton_Warrior_Idle_005.png',
    'assets/images/Player/Idle/0_Skeleton_Warrior_Idle_006.png',
    'assets/images/Player/Idle/0_Skeleton_Warrior_Idle_007.png',
    'assets/images/Player/Idle/0_Skeleton_Warrior_Idle_008.png',
    'assets/images/Player/Idle/0_Skeleton_Warrior_Idle_009.png',
    'assets/images/Player/Idle/0_Skeleton_Warrior_Idle_010.png',
    'assets/images/Player/Idle/0_Skeleton_Warrior_Idle_011.png',
    'assets/images/Player/Idle/0_Skeleton_Warrior_Idle_012.png',
    'assets/images/Player/Idle/0_Skeleton_Warrior_Idle_013.png',
    'assets/images/Player/Idle/0_Skeleton_Warrior_Idle_014.png',
    'assets/images/Player/Idle/0_Skeleton_Warrior_Idle_015.png',
    'assets/images/Player/Idle/0_Skeleton_Warrior_Idle_016.png',
    'assets/images/Player/Idle/0_Skeleton_Warrior_Idle_017.png',
  ];
  frames_kicking: string[] = [
    'assets/images/Player/Kicking/0_Skeleton_Warrior_Kicking_000.png',
    'assets/images/Player/Kicking/0_Skeleton_Warrior_Kicking_001.png',
    'assets/images/Player/Kicking/0_Skeleton_Warrior_Kicking_002.png',
    'assets/images/Player/Kicking/0_Skeleton_Warrior_Kicking_003.png',
    'assets/images/Player/Kicking/0_Skeleton_Warrior_Kicking_004.png',
    'assets/images/Player/Kicking/0_Skeleton_Warrior_Kicking_005.png',
    'assets/images/Player/Kicking/0_Skeleton_Warrior_Kicking_006.png',
    'assets/images/Player/Kicking/0_Skeleton_Warrior_Kicking_007.png',
    'assets/images/Player/Kicking/0_Skeleton_Warrior_Kicking_008.png',
    'assets/images/Player/Kicking/0_Skeleton_Warrior_Kicking_009.png',
    'assets/images/Player/Kicking/0_Skeleton_Warrior_Kicking_010.png',
    'assets/images/Player/Kicking/0_Skeleton_Warrior_Kicking_011.png',
  ];
  frames_jumping: string[] = [
    'assets/images/Player/Jump Start/0_Skeleton_Warrior_Jump Start_000.png',
    'assets/images/Player/Jump Start/0_Skeleton_Warrior_Jump Start_001.png',
    'assets/images/Player/Jump Start/0_Skeleton_Warrior_Jump Start_002.png',
    'assets/images/Player/Jump Start/0_Skeleton_Warrior_Jump Start_003.png',
    'assets/images/Player/Jump Start/0_Skeleton_Warrior_Jump Start_004.png',
    'assets/images/Player/Jump Start/0_Skeleton_Warrior_Jump Start_005.png',
  ];
  frames_running: string[] = [
    'assets/images/Player/Running/0_Skeleton_Warrior_Running_000.png',
    'assets/images/Player/Running/0_Skeleton_Warrior_Running_001.png',
    'assets/images/Player/Running/0_Skeleton_Warrior_Running_002.png',
    'assets/images/Player/Running/0_Skeleton_Warrior_Running_003.png',
    'assets/images/Player/Running/0_Skeleton_Warrior_Running_004.png',
    'assets/images/Player/Running/0_Skeleton_Warrior_Running_005.png',
    'assets/images/Player/Running/0_Skeleton_Warrior_Running_006.png',
    'assets/images/Player/Running/0_Skeleton_Warrior_Running_007.png',
    'assets/images/Player/Running/0_Skeleton_Warrior_Running_008.png',
    'assets/images/Player/Running/0_Skeleton_Warrior_Running_009.png',
    'assets/images/Player/Running/0_Skeleton_Warrior_Running_010.png',
    'assets/images/Player/Running/0_Skeleton_Warrior_Running_011.png',
  ];

  // array corrente da ciclare
  currentFrames: string[] = this.frames_idle;

  // immagini pre-caricate
  images: HTMLImageElement[] = [];

  constructor() {

    // registra il player nell'array di oggetti di scena
    this.playerOggetto = new Oggetto(this.left_fisica, this.bottom_fisica, this.larghezza_fisica, this.altezza_fisica, true, "player");
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
    const x = this.left() + dx;
    const y = this.bottom() + dy;

    this.left.set(x);
    this.bottom.set(y);
    this.playerOggetto.setPosition(x, y);
  }

  // salta giocatore
  salta(dy: number) {
    this.bottom.set(this.bottom() + dy);
    setTimeout(() => this.bottom.set(0), 500);
  }
}
