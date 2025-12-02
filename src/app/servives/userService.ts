import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserData } from '../models/userModel';

@Injectable({ providedIn: 'root' })
export class UserService {

    private users: UserData[] = [];
    private users$ = new BehaviorSubject<UserData[]>([]);

    constructor() { 
        this.loadSavedUsers(); 
    }

    // Carica gli utenti dal localStorage
    public loadSavedUsers() {
        try {
            const saved = localStorage.getItem("saved_users");
            this.users = saved ? JSON.parse(saved) as UserData[] : [];
            this.users$.next(this.users);
        } catch (err) {
            console.error('Errore estrazione utenti da localStorage:', err);
            this.users = [];
        }
    }

    // Aggiunge utente
    addUser(user: UserData) {
        this.users.push(user);
        this.users$.next(this.users);
        localStorage.setItem("saved_users", JSON.stringify(this.users));
    }

    // Restituisce observable degli utenti
    getUsers(): Observable<UserData[]> {
        return this.users$.asObservable();
    }
}
