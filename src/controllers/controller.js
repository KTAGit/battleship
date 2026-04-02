import { Ship, Player } from "../logic";

// Stores each player's instance and their ships
let playerOneData;
let playerTwoData;
// Keeps track of whose turn it is ("playerOne" | "playerTwo" | null for start)
export let trackTurn = null;

// Creates two Player instances using the provided names.
function createPlayers(playerOneName, playerTwoName) {
  const playerOne = new Player(playerOneName);
  const playerTwo = new Player(playerTwoName);
  return [playerOne, playerTwo];
}

// Generates the standard set of ships for a Battleship-style game.
function generateShips() {
  const carrier = new Ship(5, "carrier");
  const battleship = new Ship(4, "battleship");
  const destroyer = new Ship(3, "destroyer");
  const submarine = new Ship(3, "submarine");
  const patrolBoat = new Ship(2, "patrol-boat");

  return [carrier, battleship, destroyer, submarine, patrolBoat];
}

// Initializes game state by creating players and assigning ships
export function initiateNewGame(playerOneName, PlayerTwoName) {
  const [playerOne, playerTwo] = createPlayers(playerOneName, PlayerTwoName);
  const playerOneShips = generateShips();
  const playerTwoShips = generateShips();

  playerOneData = [playerOne, playerOneShips];
  playerTwoData = [playerTwo, playerTwoShips];
}

// Places a selected ship on the specified player's board
export function placeShipForPlayer(player, shipEl, coordinates, axis) {
  if (player === "playerOne") {
    for (const ship of playerOneData[1]) {
      if (ship.shipName === shipEl.dataset.name) {
        return playerOneData[0].gameboard.placeShip(ship, coordinates, axis);
      }
    }
  }
  if (player === "playerTwo") {
    for (const ship of playerTwoData[1]) {
      if (ship.shipName === shipEl.dataset.name) {
        return playerTwoData[0].gameboard.placeShip(ship, coordinates, axis);
      }
    }
  }
}

// Validates ship placement within board boundaries
export function checkShipPlacement(coordinates, length, axis) {
  const positions = [];
  // Generate ship positions based on axis direction
  for (let i = 0; i < length; i++) {
    if (axis === "x") {
      let newCoordinate = [coordinates[0], coordinates[1] + i];
      positions.push(newCoordinate);
    } else if (axis === "y") {
      let newCoordinate = [coordinates[0] + i, coordinates[1]];
      positions.push(newCoordinate);
    }
  }

  // Validate positions within bounds
  for (let [x, y] of positions) {
    if (x >= 10 || y >= 10 || x < 0 || y < 0) {
      return "invalid index";
    }
  }
}

// Executes an attack on the opposing player's gameboard.
function attackShip(player, coordinate) {
  if (player === "playerOne") {
    return playerTwoData[0].gameboard.receiveAttack(coordinate);
  }
  if (player === "playerTwo") {
    return playerOneData[0].gameboard.receiveAttack(coordinate);
  }
}

// Controls turn-based gameplay.
export function turnController(coordinate) {
  if (trackTurn === null || trackTurn === "playerOne") {
    const result = attackShip("playerOne", coordinate);
    trackTurn = "playerTwo";
    return result;
  }
  if (trackTurn === "playerTwo") {
    const result = attackShip("playerTwo", coordinate);
    trackTurn = "playerOne";
    return result;
  }
}
