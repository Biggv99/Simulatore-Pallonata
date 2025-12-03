import { Component, inject, OnInit } from '@angular/core';
import { Vittima } from '../../components/Playground/vittima/vittima';
import { Player } from '../../components/Playground/player/player';
import { Campo } from '../../components/Playground/campo/campo';
import { Palla } from '../../components/Playground/palla/palla';
import { Presentatore } from '../../components/Playground/presentatore/presentatore';
import { PlayerService } from '../../services/playerService';
import { FisicaService } from '../../services/Fisica/fisicaService';

@Component({
  selector: 'app-playgroundpage',
  standalone: true,
  imports: [Vittima, Player, Campo, Palla, Presentatore],
  templateUrl: './playgroundpage.html',
  styleUrls: ['./playgroundpage.scss'],
})
export class Playgroundpage implements OnInit {

  private playerService = inject(PlayerService);
  playerSignal = this.playerService.getPlayer();

  private fisica: FisicaService = inject(FisicaService);
  private timer: any;

  ngOnInit() {
    // se esiste un player
    if (this.playerSignal() !== null) {
      // aumenta il tempo di gioco del player ogni secondo
      this.timer = setInterval(() => {
        const attuale = this.playerSignal()?.tempoGioco ?? 0;
        this.playerService.setTime(attuale + 1);
      }, 1000);
    }

    this.fisica.startCollisionLoop();
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
    this.fisica.stopCollisionLoop();
  }
}
