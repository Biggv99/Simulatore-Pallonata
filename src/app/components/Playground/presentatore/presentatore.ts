import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-presentatore',
  templateUrl: './presentatore.html',
  styleUrl: './presentatore.scss',
})
export class Presentatore implements OnInit {

  entra = signal(false); 
  uscita = signal(false);          
  istruzioniVisibili = signal(false); 
     
  ngOnInit() {
    this.playEntrance();
  }

  playEntrance() {
    this.uscita.set(false);
    this.istruzioniVisibili.set(false);

    setTimeout(() => {
      this.entra.set(true);
      setTimeout(() => {
        this.istruzioniVisibili.set(true);
      }, 2000);

    }, 50);
  }

  playUscita() {
    this.istruzioniVisibili.set(false);
    setTimeout(() => {
      this.uscita.set(true); 
    }, 200);
  }
}
