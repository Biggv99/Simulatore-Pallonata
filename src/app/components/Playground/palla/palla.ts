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

  // -- DATI -- //

  private fisica: FisicaService = inject(FisicaService);
  private pallaOggetto: Oggetto;

  private keyboard: keyboardService = inject(keyboardService);;

  private effectInterval: number | null = null;
  
  // posizione palla
  x = signal(110);
  y = signal(25); 

  // frame: immagini effetti
  frame_effetti = signal(0);
  frames_hitEffect = generaFrames('assets/images/Effetti/flame/', 40, 2);
  currentFrames_effetti: string[] | null = null;
  images_effetti: HTMLImageElement[] = [];
  

  // Event per notificare l’impatto
  @Output() colpita = new EventEmitter<number>();

  // -- COSTRUTTORE -- //
  constructor() {

    // registra il palla nell'array di oggetti di scena
    this.pallaOggetto = new Oggetto(110, 25, 50, 50, true, "palla");
    this.fisica.registraOggetto(this.pallaOggetto);

    // gestione keyboard: spacebar
    this.keyboard.onShiftPress(() => {

      // cerca negli oggetti di scena l'oggetto col tipo player
      const player = this.fisica.getOggetti().find(o => o.tipo === 'player');
      if (!player) return;

      // se la palla interseca con il player tira
      if (this.fisica.interseca(this.pallaOggetto, player)){
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

  // -- METODI -- //

  // Azione dalla spacebar
  pallaAvanza() {
    // numero casuale per l'attivazione dell'effetto
    const randomNumber = Math.floor(Math.random() * 3);

    // effetto si attiva
    if (randomNumber === 2) {
      this.currentFrames_effetti = this.frames_hitEffect;
      this.frame_effetti.set(0);

      // interval per cambiare i frame 
      this.effectInterval = window.setInterval(() => {
        if (this.currentFrames_effetti) {
          this.frame_effetti.set(
            (this.frame_effetti() + 1) % this.currentFrames_effetti.length
          );
        }
      }, 30);
    }

    // movimento palla 
    this.x.set(this.x() + 1660);
    this.y.set(this.y() + 50);

    // tempo di colpo: termina animazione
    setTimeout(() => {

      // pulisco interval
      if (this.effectInterval !== null) {
        clearInterval(this.effectInterval);
        this.effectInterval = null;
      }

      // nascondo effetto e resetto segnali
      this.currentFrames_effetti = null;

      // evento e reset palla
      if(randomNumber === 0){
        this.colpita.emit(1);
      } else {
        this.colpita.emit(3);
      }

      // rimette la palla nella posizione originale
      this.x.set(110);
      this.y.set(25);
    }, 400);
  }
}
