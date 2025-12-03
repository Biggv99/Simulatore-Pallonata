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

  //posizione
  x = signal(110);
  y = signal(25); 

  // frame 
  frame_effetti = signal(0);
  frames_hitEffect = generaFrames('assets/images/Effetti/flame/', 40, 2);

  currentFrames_effetti: string[] | null = null;
  images_effetti: HTMLImageElement[] = [];
  
  // Event per notificare l’impatto
  @Output() colpita = new EventEmitter<number>();

  constructor() {

    // fisica palla: oggetti di scena
    let fisica: FisicaService = inject(FisicaService);
    let pallaOggetto: Oggetto;
    pallaOggetto = new Oggetto(110, 25, 50, 50, true, "palla");
    fisica.registraOggetto(pallaOggetto);

    // gestione keyboard: shift premuto
    let keyboard: keyboardService = inject(keyboardService);
    keyboard.onShiftPress(() => {

      // cerca negli oggetti di scena l'oggetto col tipo player
      const player = fisica.getOggetti().find(o => o.tipo === 'player');
      if (!player) return;

      // se la palla interseca con il player tira
      if (fisica.interseca(pallaOggetto, player)){
        this.pallaAvanza();
      }
    });

    // pre-carica tutte le immagini effetti
    this.frames_hitEffect.forEach(src => {
      const img = new Image();
      img.src = src;
      this.images_effetti.push(img);
    });
  }

  // Azione tiro palla
  pallaAvanza() {

    let effectTimer: number | null = null;
    
    // numero casuale per l'attivazione dell'effetto
    const randomNumber = Math.floor(Math.random() * 3);
    if (randomNumber === 2) {
      this.currentFrames_effetti = this.frames_hitEffect;
      this.frame_effetti.set(0);

      // interval per cambiare i frame 
      effectTimer = window.setInterval(() => {
        if (this.currentFrames_effetti) {
          this.frame_effetti.set( (this.frame_effetti() + 1) % this.currentFrames_effetti.length );
        }
      }, 30);
    }

    // movimento palla 
    this.x.set(this.x() + 1660);
    this.y.set(this.y() + 50);

    // tempo di colpo: termina animazione
    setTimeout(() => {

      // pulisco interval
      if (effectTimer !== null) {
        clearInterval(effectTimer);
        effectTimer = null;
      }

      // nascondo effetto e resetto segnali
      this.currentFrames_effetti = null;

      // evento e reset palla
      this.colpita.emit(randomNumber === 0 ? 1 : 3);

      // rimette la palla nella posizione originale
      this.x.set(110);
      this.y.set(25);
    }, 400);
  }
}
