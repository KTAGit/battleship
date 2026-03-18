export class Ship {
  constructor(shipLength) {
    this.shipLength = shipLength;
    this.hitDamage = 0;
  }

  hit() {
    this.hitDamage += 1;
  }

  isSunk() {
    if (this.shipLength === this.hitDamage) {
      return true;
    } else {
      return false;
    }
  }
}
