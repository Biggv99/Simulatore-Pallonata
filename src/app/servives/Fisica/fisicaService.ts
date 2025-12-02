import { Injectable } from '@angular/core';
import { Oggetto } from './Oggetto';

@Injectable({ providedIn: 'root' })
export class FisicaService {

    // Array di oggetti di scena
    private oggetti: Oggetto[] = [];

    // Aggiungi oggetto alla scena
    registraOggetto(obj: Oggetto) {
        const esiste = this.oggetti.some(o => o.tipo === obj.tipo);
        if (!esiste) {
            this.oggetti.push(obj);
        }
    }

    // Restituisce tutti gli oggetti registrati
    getOggetti() {
        return this.oggetti;
    }

    // Hitbox costruita dalla classe Oggetto
    private getHitbox(obj: Oggetto) {
        return {
            x: obj.x,
            y: obj.y,
            width: obj.larghezza,
            height: obj.altezza
        };
    }

    // Inizia il loop automatico che controlla le collisioni 
    private tricksTimer: any;
    startCollisionLoop() { 
        if (this.tricksTimer) return; 

        this.tricksTimer = setInterval(() => {
            this.checkAllCollisions();
        }, 10);
    }

    // Stoppa il loop automatico che controlla le collisioni 
    stopCollisionLoop() {
        if (this.tricksTimer) {
            clearInterval(this.tricksTimer);
            this.tricksTimer = null;
        }
    }

    // Controlla tutte le collisioni
    checkAllCollisions() {
        const lista = this.oggetti;

        for (let i = 0; i < lista.length; i++) {
            const a = lista[i];

            for (let j = i + 1; j < lista.length; j++) {
                const b = lista[j];

                if (this.interseca(a, b)) {
                    console.log(a.tipo, " collide con ", b.tipo);
                    console.log(a, b);
                }
            }
        }
    }

    // collisione tra due Oggetto
    interseca(a: Oggetto, b: Oggetto) {

        // calcolo centro degli oggetti
        const aCx = a.x - a.larghezza / 2;
        const aCy = a.y - a.altezza / 2;
        const bCx = b.x - b.larghezza / 2;
        const bCy = b.y - b.altezza / 2;

        // confronto usando metà larghezza e altezza
        const collideX = Math.abs(aCx - bCx) < (a.larghezza/2 + b.larghezza/2);
        const collideY = Math.abs(aCy - bCy) < (a.altezza/2 + b.altezza/2);
        return collideX && collideY;
    }


}

/*
// Movimento con fisica "a spinta"
    muoviOggetto(oggetto: Oggetto, dx: number, dy: number) {

        if (!oggetto.movibile) return;

        const coda: Oggetto[] = [oggetto];
        const gruppo = new Set<Oggetto>([oggetto]);

        while (coda.length > 0) {

            const attuale = coda.shift()!;
            const futuraHitbox = {
                x: attuale.x + dx,
                y: attuale.y + dy,
                width: attuale.larghezza,
                height: attuale.altezza
            };

            for (const ostacolo of this.oggetti) {

                if (ostacolo === attuale) continue;

                if (this.interseca(futuraHitbox, this.getHitbox(ostacolo))) {
                    if (!ostacolo.movibile) return;
                    if (!gruppo.has(ostacolo)) {
                        coda.push(ostacolo);
                        gruppo.add(ostacolo);
                    }
                }
            }
        }

        // Muovi tutto il gruppo
        gruppo.forEach(o => {
            o.x += dx;
            o.y += dy;
        });
    }
*/

/*
  //Metodo di movimento con collisioni
  muovi(dx: number, dy: number, ostacoli: Oggetto[]) {
    if (!this.movibile) return;

    const coda: Oggetto[] = [this];
    const gruppo = new Set<Oggetto>([this]);

    while (coda.length > 0) {
      const attuale = coda.shift()!;
      const futuraHitbox = {
        x: attuale.x + dx,
        y: attuale.y + dy,
        width: attuale.larghezza,
        height: attuale.altezza
      };

      for (const ostacolo of ostacoli) {
        if (ostacolo !== attuale && this.interseca(futuraHitbox, ostacolo.getHitbox())) {
          if (!ostacolo.movibile) return;
          if (!gruppo.has(ostacolo)) {
            coda.push(ostacolo);
            gruppo.add(ostacolo);
          }
        }
      }
    }

    // Muovi tutto il gruppo
    gruppo.forEach(o => {
      o.x += dx;
      o.y += dy;
    });
  }

  private interseca(a: any, b: any) {
    return !(
      a.x + a.width < b.x ||
      a.x > b.x + b.width ||
      a.y + a.height < b.y ||
      a.y > b.y + b.height
    );
  }
*/

/*
// Controlla le collisione fra oggetti
    

    */