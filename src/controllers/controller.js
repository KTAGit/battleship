import { Ship, Player } from "../logic";
import {
  renderTurn,
  placeShipForComputer,
  markBoard,
  indicateTurn,
  indicateHit,
} from "../ui/renderGameboard";
import { currentSetting } from "./initialScreen";

// Stores each player's instance and their ships
export let playerOneData;
export let playerTwoData;
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
  if (player === "playerTwo" || player === "computer") {
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
    const result = playerTwoData[0].gameboard.receiveAttack(coordinate);
    if (result[0] === "gameover") {
      const stats = calculateStats(playerTwoData[0]);
      result.push(stats);
      result.push(playerOneData[0].playerName);
    }
    return result;
  }
  if (player === "playerTwo") {
    const result = playerOneData[0].gameboard.receiveAttack(coordinate);
    if (result[0] === "gameover") {
      const stats = calculateStats(playerOneData[0]);
      result.push(stats);
      result.push(playerTwoData[0].playerName);
    }
    return result;
  }
}

// Controls turn-based gameplay.
export function turnController(coordinate) {
  if (trackTurn === null || trackTurn === "playerOne") {
    const result = attackShip("playerOne", coordinate);
    if (result === "invalid coordinates") return;
    indicateTurn("playerOne");
    trackTurn = "playerTwo";
    renderTurn(playerTwoData[0].playerName);
    if (currentSetting === "playerVsComputer") {
      computerPlayer("computer's turn");
    }
    return result;
  }
  if (trackTurn === "playerTwo") {
    const result = attackShip("playerTwo", coordinate);
    if (result === "invalid coordinates") return;
    indicateTurn("playerTwo");
    trackTurn = "playerOne";
    renderTurn(playerOneData[0].playerName);
    return result;
  }
}

// Calculates player performance stats: hits, misses, and accuracy percentage
function calculateStats(player) {
  const missedShots = player.gameboard.missedShot.length;
  const hits = player.gameboard.storeHit.length;
  const totalMove = missedShots + hits;
  const accuracy = (hits / totalMove) * 100;
  return [hits, missedShots, accuracy];
}

// Handles computer behavior for ship placement and turn-based attack generation
export function computerPlayer(gameStatus) {
  const playerOneBoard = playerOneData[0].gameboard;
  const computerPlayerBoard = playerTwoData[0].gameboard;
  const ignoreCoordinate = [
    ...playerOneBoard.missedShot,
    ...playerOneBoard.storeHit,
  ];
  const playerTwoShipPositions = computerPlayerBoard.shipPositions;
  const ignoreShipCoordinate = [];

  for (let i = 0; i < playerTwoShipPositions.length; i++) {
    const object = playerTwoShipPositions[i];
    ignoreShipCoordinate.push(...object.position);
  }

  if (gameStatus === "place your fleet") {
    const fleetCount = playerTwoData[1].length;
    let countGen = 0;
    var axis = ["y", "x"];
    while (countGen < fleetCount) {
      let coordinate = generateCoordinate(ignoreShipCoordinate);
      let ship = playerTwoData[1][countGen];
      let randomAxis = axis[Math.random() < 0.5 ? 0 : 1];
      let result = playerTwoData[0].gameboard.placeShip(
        ship,
        coordinate,
        randomAxis,
      );

      if (result === "invalid index" || result === "overlap") continue;
      placeShipForComputer(ship, coordinate, randomAxis);
      countGen++;
    }
  }

  if (gameStatus === "computer's turn") {
    const playerOneGrid = document.querySelector(".playerone-grid");
    const randomCoordinate = generateCoordinate(ignoreCoordinate);
    const targetCell = playerOneGrid.querySelector(
      `[data-x='${randomCoordinate[0]}'][data-y='${randomCoordinate[1]}']`,
    );
    setTimeout(() => {
      const result = turnController(randomCoordinate);
      markBoard(result, targetCell);
      if (result === "hit") {
        indicateHit(playerOneGrid);
      }
    }, 1000);
  }
}

// Returns a random valid grid coordinate not included in the ignore list
function generateCoordinate(ignoreCoordinate) {
  let coordinate;
  let isExcluded;
  do {
    const x = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
    const y = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
    coordinate = [x, y];

    isExcluded = ignoreCoordinate.some(
      (i) => i[0] === coordinate[0] && i[1] === coordinate[1],
    );
  } while (isExcluded);
  {
    return coordinate;
  }
}
