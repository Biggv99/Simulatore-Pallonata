export class Oggetto {

  x: number;
  y: number;
  larghezza: number;
  altezza: number;
  movibile: boolean;
  tipo: string; 

  constructor(x: number, y: number, larghezza: number, altezza: number, movibile: boolean, tipo: string = '') {
    this.x = x;
    this.y = y;
    this.larghezza = larghezza;
    this.altezza = altezza;
    this.movibile = movibile;
    this.tipo = tipo; 
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

