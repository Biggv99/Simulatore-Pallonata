import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../servives/playerService';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar { 
  private playerService = inject(PlayerService);
  playerSignal = this.playerService.getPlayer();

  onPress() {
    this.playerService.logout();
  }
}
