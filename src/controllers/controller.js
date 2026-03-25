import { Ship, Player } from "../logic";

// Initialize a new game immediately with two players
const [playerOne, playerTwo] = initiateNewGame("John", "Alex");
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

/**
 * Initializes a new game:
 * - Creates players
 * - Generates ships for both players
 * - Places ships on predefined coordinates and orientations
 */
function initiateNewGame(playerOneName, PlayerTwoName) {
  const [playerOne, playerTwo] = createPlayers(playerOneName, PlayerTwoName);
  const playerOneShips = generateShips();
  const playertwoShips = generateShips();

  // Predefined ship placement coordinates
  const coordinates = [
    [2, 2],
    [5, 3],
    [1, 8],
    [3, 4],
    [6, 4],
  ];

  // Axis for ship placement ("x" = horizontal, "y" = vertical)
  const shipAxis = ["y", "x", "y", "x", "y"];

  // Place ships for player one
  for (let i = 0; i < playerOneShips.length; i++) {
    const ship = playerOneShips[i];
    playerOne.gameboard.placeShip(ship, coordinates[i], shipAxis[i]);
  }
  // Place ships for player two
  for (let i = 0; i < playertwoShips.length; i++) {
    const ship = playertwoShips[i];
    playerTwo.gameboard.placeShip(ship, coordinates[i], shipAxis[i]);
  }
  return [playerOne, playerTwo];
}

// Executes an attack on the opposing player's gameboard.
function attackShip(player, coordinate) {
  if (player === "playerOne") {
    return playerTwo.gameboard.receiveAttack(coordinate);
  }
  if (player === "playerTwo") {
    return playerOne.gameboard.receiveAttack(coordinate);
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
