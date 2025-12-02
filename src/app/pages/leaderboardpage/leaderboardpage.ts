import { Component, OnInit, inject, signal } from '@angular/core';
import { UserService } from '../../servives/userService';
import { UserData } from '../../models/userModel';

@Component({
  selector: 'app-leaderboardpage',
  templateUrl: './leaderboardpage.html',
  styleUrls: ['./leaderboardpage.scss'],
})
export class Leaderboardpage implements OnInit {

  private userService = inject(UserService);
  savedUsers: UserData[] = [];

  // memorizza l'ordine attuale (ascendente o discendente)
  sortDirection: { [key: string]: 'asc' | 'desc' } = {};

  ngOnInit() {
    this.userService.loadSavedUsers(); // senza questa non me li carica
    this.userService.getUsers().subscribe(users => {
        this.savedUsers = users;
    });
  }

  sortBy(column: keyof UserData) {
    const direction = this.sortDirection[column] === 'asc' ? 'desc' : 'asc';
    this.sortDirection[column] = direction;

    this.savedUsers.sort((a, b) => {
      if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
      if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
      return 0;
    });
  }
}
