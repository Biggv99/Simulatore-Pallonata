import { Component, signal, inject, Output, EventEmitter } from '@angular/core';
import { keyboardService } from '../../../services/keyboardService';
import { FisicaService } from '../../../services/Fisica/fisicaService';
import { Oggetto } from '../../../services/Fisica/Oggetto';
import { generaFrames } from '../../../services/frameService';

@Component({
  selector: 'app-palla',
  templateUrl: './palla.html',
  styleUrls: ['./palla.scss'],
})
export class Palla {

  // fisica palla
  private fisica: FisicaService = inject(FisicaService);
  pallaOggetto: Oggetto;

  //posizione
  x = signal(110);
  y = signal(25);

  // stato animazione iniziale
  frame = signal(0);

  // frames
  currentFrames: string[] = [];
  frames_flames = generaFrames('assets/images/Effetti/flame/', 40, 2);

  // immagini
  images: HTMLImageElement[] = [];
  
  // event per notificare iil possibile impatto
  @Output() colpo = new EventEmitter<boolean>();

  constructor() {

    // registra palla negli oggetti di scena
    this.pallaOggetto = new Oggetto(110, 25, 50, 50, true, "palla");
    this.fisica.registraOggetto(this.pallaOggetto);

    // preload immagini 
    [...this.frames_flames].forEach(src => {
      const img = new Image();
      img.src = src;
      this.images.push(img);
    });

    // keyboard
    const keyboard: keyboardService = inject(keyboardService);

    keyboard.onShiftPress(() => {
      // se la palla interseca con il player tira
      let player = this.fisica.getOggetti().find(o => o.tipo === 'player');
      if (player && this.fisica.interseca(this.pallaOggetto, player)) {
        this.playMovingAnimation();
      }
    });
  }

  playMovingAnimation() {
    // Movimento palla (da cambiare)
    this.x.set(this.x() + 1660);
    this.y.set(this.y() + 50);
    this.pallaOggetto.setPosition(this.x(), this.y());
    
    // Estrae un numero casuale per l'attivazione dell'effetto fiamme
    const randomNumber = Math.floor(Math.random() * 3); 
    if (randomNumber === 2) {
      this.currentFrames = this.frames_flames;
      this.frame.set(0);

      const animationInterval = setInterval(() => {

        // avanza il frame
        this.frame.set((this.frame() + 1) % this.currentFrames.length);

        if (this.frame() === this.currentFrames.length - 1) {
          clearInterval(animationInterval);
          this.currentFrames = [];
          this.frame.set(0);
        }
      }, 7);
    }

    // evento tentativo colpo
    this.colpo.emit(randomNumber === 2 ? true : false);

    // riposiziona palla davanti al player
    setTimeout(() => {
      let player = this.fisica.getOggetti().find(o => o.tipo === 'player');
      if (player) {
        const x = player.x + (player.larghezza / 2);
        const y = player.y + 25;

        this.x.set(x);
        this.y.set(y);
        this.pallaOggetto.setPosition(x, y);
      }
    }, 215);
  }
}
