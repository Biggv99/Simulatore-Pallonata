import { Component, signal, inject, Output, EventEmitter } from '@angular/core';
import { keyboardService } from '../../../servives/keyboardService';
import { FisicaService } from '../../../servives/Fisica/fisicaService';
import { Oggetto } from '../../../servives/Fisica/Oggetto';

@Component({
  selector: 'app-palla',
  templateUrl: './palla.html',
  styleUrls: ['./palla.scss'],
})
export class Palla {

  private fisica: FisicaService = inject(FisicaService);
  left_fisica = 0;
  bottom_fisica = 0;
  larghezza_fisica = 50;
  altezza_fisica = 50;
  pallaOggetto: Oggetto;

  // posizione palla
  left = signal(110); 
  bottom = signal(25); 

  constructor() {

    // registra il palla nell'array di oggetti di scena
    this.pallaOggetto = new Oggetto(this.left_fisica, this.bottom_fisica, this.larghezza_fisica, this.altezza_fisica, true, "palla");
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

  // keyboard
  private keyboard: keyboardService = inject(keyboardService);;

  // frame: immagini effetti
  frame_effetti = signal(0);
  frames_hitEffect: string[] = [
    'assets/images/Effetti/flame/00.png',
    'assets/images/Effetti/flame/01.png',
    'assets/images/Effetti/flame/02.png',
    'assets/images/Effetti/flame/03.png',
    'assets/images/Effetti/flame/04.png',
    'assets/images/Effetti/flame/05.png',
    'assets/images/Effetti/flame/06.png',
    'assets/images/Effetti/flame/07.png',
    'assets/images/Effetti/flame/08.png',
    'assets/images/Effetti/flame/09.png',
    'assets/images/Effetti/flame/10.png',
    'assets/images/Effetti/flame/11.png',
    'assets/images/Effetti/flame/12.png',
    'assets/images/Effetti/flame/13.png',
    'assets/images/Effetti/flame/14.png',
    'assets/images/Effetti/flame/15.png',
    'assets/images/Effetti/flame/16.png',
    'assets/images/Effetti/flame/17.png',
    'assets/images/Effetti/flame/18.png',
    'assets/images/Effetti/flame/19.png',
    'assets/images/Effetti/flame/20.png',
    'assets/images/Effetti/flame/21.png',
    'assets/images/Effetti/flame/22.png',
    'assets/images/Effetti/flame/23.png',
    'assets/images/Effetti/flame/24.png',
    'assets/images/Effetti/flame/25.png',
    'assets/images/Effetti/flame/26.png',
    'assets/images/Effetti/flame/27.png',
    'assets/images/Effetti/flame/28.png',
    'assets/images/Effetti/flame/29.png',
    'assets/images/Effetti/flame/30.png',
    'assets/images/Effetti/flame/31.png',
    'assets/images/Effetti/flame/32.png',
    'assets/images/Effetti/flame/33.png',
    'assets/images/Effetti/flame/34.png',
    'assets/images/Effetti/flame/35.png',
    'assets/images/Effetti/flame/36.png',
    'assets/images/Effetti/flame/37.png',
    'assets/images/Effetti/flame/38.png',
    'assets/images/Effetti/flame/39.png',
  ];
  currentFrames_effetti: string[] | null = null;
  images_effetti: HTMLImageElement[] = [];

  // Event per notificare l’impatto
  @Output() colpita = new EventEmitter<number>();

  // intervallo di effetto 
  private effectInterval: number | null = null;

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
    this.left.set(this.left() + 1660);
    this.bottom.set(this.bottom() + 50);

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
      this.left.set(110);
      this.bottom.set(25);
    }, 400);
  }
}
