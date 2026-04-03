// Represents a ship with a name, length, and damage tracking
export class Ship {
  constructor(shipLength, shipName) {
    this.shipName = shipName;
    this.shipLength = shipLength;
    this.hitDamage = 0;
  }

  // Increments the ship's damage when it is hit
  hit() {
    this.hitDamage += 1;
  }

  // Checks whether the ship has been sunk (all positions hit)
  isSunk() {
    if (this.shipLength === this.hitDamage) {
      return true;
    } else {
      return false;
    }
  }
}

// Represents the gameboard that manages ships and attacks
export class Gameboard {
  constructor() {
    this.shipPositions = [];
    this.missedShot = [];
    this.storeHit = [];
    this.sunkShips = 0;
  }

  // Checks if a given coordinate overlaps with any existing ship position
  isOverlap(coordinates, shipName) {
    for (let i = 0; i < this.shipPositions.length; i++) {
      const obj = this.shipPositions[i];
      for (let j = 0; j < obj.position.length; j++) {
        if (
          obj.position[j][0] === coordinates[0] &&
          obj.position[j][1] === coordinates[1] &&
          shipName !== obj.shipObj.shipName
        ) {
          return true;
        }
      }
    }
    return false;
  }

  // Places a ship on the board based on starting coordinates and axis (x or y)
  placeShip(ship, coordinates, axis) {
    const positions = [];

    // Generate ship positions based on axis direction
    for (let i = 0; i < ship.shipLength; i++) {
      if (axis === "x") {
        let newCoordinate = [coordinates[0], coordinates[1] + i];
        positions.push(newCoordinate);
      } else if (axis === "y") {
        let newCoordinate = [coordinates[0] + i, coordinates[1]];
        positions.push(newCoordinate);
      }
    }

    // Validate positions (within bounds and no overlap)
    for (let [x, y] of positions) {
      if (x >= 10 || y >= 10 || x < 0 || y < 0) {
        return "invalid index";
      }
      if (this.isOverlap([x, y], ship.shipName)) {
        return "overlap";
      }
    }

    for (let i = 0; i < this.shipPositions.length; i++) {
      const object = this.shipPositions[i];

      if (object.shipObj.shipName === ship.shipName) {
        object.position = positions;
        return;
      }
    }

    // Store the ship and its valid positions
    this.shipPositions.push({
      shipObj: ship,
      position: positions,
    });
  }

  // Determines if all ships have been sunk (game over condition)
  isGameOver() {
    return this.sunkShips === this.shipPositions.length ? true : false;
  }

  // Processes an attack at given coordinates and returns the result
  receiveAttack(coordinates) {
    // Prevent duplicate attacks on the same coordinate
    const isHitExist = this.storeHit.some(
      (arr) => arr[0] === coordinates[0] && arr[1] === coordinates[1],
    );

    const isMissedExist = this.missedShot.some(
      (arr) => arr[0] === coordinates[0] && arr[1] === coordinates[1],
    );

    if (isHitExist || isMissedExist) {
      return "invalid coordinates";
    }
    // Check if attack hits any ship
    for (let i = 0; i < this.shipPositions.length; i++) {
      const obj = this.shipPositions[i];
      for (let j = 0; j < obj.position.length; j++) {
        if (
          obj.position[j][0] === coordinates[0] &&
          obj.position[j][1] === coordinates[1]
        ) {
          const ship = obj.shipObj;

          // Ignore hits on already sunk ships
          if (ship.isSunk()) return "already sunk";
          ship.hit();
          this.storeHit.push(coordinates);

          // Check if the ship is now sunk
          if (ship.isSunk()) {
            this.sunkShips += 1;
          }

          // Return result of the attack
          if (this.isGameOver()) {
            console.log(this.shipPositions);
            console.log("gameover");
            return "gameover";
          } else {
            return "hit";
          }
        }
      }
    }

    // If no ship is hit, record as a miss
    this.missedShot.push(coordinates);
    return "miss";
  }
}

export class Player {
  constructor(playerName, playerType) {
    this.playerName = playerName;
    this.playerType = playerType;
    this.gameboard = new Gameboard();
  }
}
