import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../servives/userService';
import { UserData } from '../../models/userModel';
import { PlayerService } from '../../servives/playerService';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.scss']
})
export class Homepage implements OnInit {

  // servizi
  private userService = inject(UserService);
  private playerService = inject(PlayerService);

  // array utenti salvati
  savedUsers: UserData[] = [];

  // form reattivo
  myForm = new FormGroup({
    username: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required)
  });

  // modalità: login o registrazione
  mode: 'login' | 'register' = 'login';

  ngOnInit() {

    // Carica gli utenti dal localStorage
    this.userService.getUsers().subscribe(users => {
      this.savedUsers = users;
    });
  }

  // Invio form
  submitForm() {
    if (this.myForm.invalid) {
      alert('Form non valido');
      return;
    }

    const username = this.myForm.value.username!;
    const password = this.myForm.value.password!;
    const existingUser = this.savedUsers.find(u => u.name === username);

    if (this.mode === 'register') {
      this.handleRegister(existingUser, username, password);
    } else {
      this.handleLogin(existingUser, password);
    }
  }

  // Registrazione
  private handleRegister(existingUser: UserData | undefined, username: string, password: string) {
    if (existingUser) {
      alert('Utente già esistente!');
      return;
    }

    const newUser: UserData = {
      name: username,
      password,
      tempoGioco: 0,
      punteggioTotale: 0,
      punteggioMassimo: 0
    };

    this.userService.addUser(newUser);
    alert('Registrazione avvenuta con successo!');
    this.myForm.reset();
  }

  // Login
  private handleLogin(existingUser: UserData | undefined, password: string) {
    if (!existingUser || existingUser.password !== password) {
      alert('Credenziali errate!');
      return;
    }

    this.playerService.login(existingUser);
    this.myForm.reset();
  }

  // Switch: login o register
  toggleMode() {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.myForm.reset();
  }
}
