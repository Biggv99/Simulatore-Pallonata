import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class keyboardService {

  // array di callback da chiamare quando viene premuta la barra spaziatrice
  private spaceCallbacks: (() => void)[] = [];
  private aCallbacks: (() => void)[] = [];
  private dCallbacks: (() => void)[] = [];
  private shiftCallbacks: (() => void)[] = [];
  private aCallbacksRelease: (() => void)[] = [];
  private dCallbacksRelease: (() => void)[] = [];

  private canPressSpace = true;
  private canPressShift = true;

  constructor() {

    // ascolta tutti tasti premuti
    fromEvent<KeyboardEvent>(window, 'keydown').subscribe(e => {

      // barra spaziatrice 
      if (e.code === 'Space' && this.canPressSpace) {
        this.canPressSpace = false;       
        this.spaceCallbacks.forEach(cb => cb());
        setTimeout(() => this.canPressSpace = true, 1000);
      }

      // tasti di movimento
      if (e.code === 'KeyA') {   
        this.aCallbacks.forEach(cb => cb());
      }
      if (e.code === 'KeyD') {   
        this.dCallbacks.forEach(cb => cb());
      }
  
      // shift
      if (e.code === 'ShiftLeft' && this.canPressShift) {
        this.canPressShift = false;       
        this.shiftCallbacks.forEach(cb => cb());
        setTimeout(() => this.canPressShift = true, 1000);
      }
    });

     // ascolta tutti tasti rilasciati
    fromEvent<KeyboardEvent>(window, 'keyup').subscribe(e => {
      if (e.code === 'KeyA') this.aCallbacksRelease.forEach(cb => cb());
      if (e.code === 'KeyD') this.dCallbacksRelease.forEach(cb => cb());
    });
  }

  onSpacePress(cb: () => void) { this.spaceCallbacks.push(cb);}
  onAPress(cb: () => void) { this.aCallbacks.push(cb); }
  onDPress(cb: () => void) { this.dCallbacks.push(cb); }
  onShiftPress(cb: () => void) { this.shiftCallbacks.push(cb); }
  onARelease(cb: () => void) { this.aCallbacksRelease.push(cb); }
  onDRelease(cb: () => void) { this.dCallbacksRelease.push(cb); }
}
