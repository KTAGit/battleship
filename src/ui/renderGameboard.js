import {
  turnController,
  trackTurn,
  checkShipPlacement,
  placeShipForPlayer,
  playerOneData,
  playerTwoData,
} from "../controllers/controller";
import { draggedFleet, finalCheck, rotateShip } from "../controllers/fleet";
import { announceVictory } from "./victory";

// Timer state variables (formatted as HH:MM:SS) and interval reference
export let sec = "00";
export let min = "00";
export let hour = "00";
export let intervalId;

// Tracks whether the game has started to prevent duplicate initialization
export let isGameStart = false;

// Stores player ship configurations after setup is complete
let storePlayerShipConfig = [];

// DOM references for both players gameboard containers
const playerOneContainer = document.querySelector(".playerone-grid");
const playeTwoContainer = document.querySelector(".playertwo-grid");
const mainSection = document.querySelector(".main-section");

/**
 * Generates a 10x10 grid (100 cells).
 * Each cell is a div with dataset coordinates (x, y).
 * @returns {HTMLElement[]} Array of grid cell elements
 */
function generateGrid() {
  const storeGrid = [];

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const grid = document.createElement("div");
      grid.classList.add(`grid-cell`);

      // Store coordinates directly on the element for easy access on click
      grid.dataset.x = i;
      grid.dataset.y = j;

      storeGrid.push(grid);
    }
  }
  return storeGrid;
}

// Renders both players grids onto the DOM.
function renderPlayersGrid() {
  const playerOneGrids = generateGrid();
  const playerTwoGrids = generateGrid();

  // Render Player One's grid
  for (let i = 0; i < playerOneGrids.length; i++) {
    const element = playerOneGrids[i];
    playerOneContainer.appendChild(element);
  }

  // Render Player Two's grid
  for (let i = 0; i < playerTwoGrids.length; i++) {
    const element = playerTwoGrids[i];
    playeTwoContainer.appendChild(element);
  }
}

// Updates a grid cell visually based on attack result.
export function markBoard(action, element) {
  if (!action) return;
  if (action === "hit" || action[0] === "gameover") {
    element.classList.add("hit");
    element.textContent = "✕";
    if (action[0] === "gameover") {
      announceVictory(action[2], action[1]);
    }
  } else if (action === "miss") {
    element.classList.add("miss");
    element.textContent = "◦";
  }
}

// Matches a ship element, rotates if needed, places it on the board, and stores config when all ships are placed
export function placeShipForComputer(shipObj, coordinate, axis) {
  const storeShip = [];
  for (let i = 0; i <= 4; i++) {
    const shipEl = document.querySelector(`.img-${i}.playertwo`);
    storeShip.push(shipEl);
  }

  for (const ship of storeShip) {
    if (ship.dataset.name === shipObj.shipName) {
      if (ship.dataset.axis === "x" && axis === "y") {
        rotateShipForComputer(ship);
        ship.dataset.axis = axis;
      }
      appendShipForComputer(ship, coordinate);
    }
  }
  const shipLayerChildCount = document.querySelector(
    ".ship-layer-pleyertwo",
  ).childElementCount;
  if (shipLayerChildCount === 5) {
    let playerTwoConfig = document
      .querySelector(".ship-layer-pleyertwo")
      .remove();
    storePlayerShipConfig.push(playerTwoConfig);
  }
}

// Event listener for Player One's board.
playerOneContainer.addEventListener("click", (e) => {
  if (isGameStart === false) return;
  if (trackTurn === "playerTwo") {
    if (e.target.classList.contains("grid-cell")) {
      const x = Number(e.target.dataset.x);
      const y = Number(e.target.dataset.y);
      markBoard(turnController([x, y]), e.target);
    }
  }
});

// Event listener for Player Two's board.
playeTwoContainer.addEventListener("click", (e) => {
  if (isGameStart === false) return;
  if (trackTurn === null || trackTurn === "playerOne") {
    if (e.target.classList.contains("grid-cell")) {
      const x = Number(e.target.dataset.x);
      const y = Number(e.target.dataset.y);
      markBoard(turnController([x, y]), e.target);
    }
  }
});

// Listens for clicks in the main section and handles the start button logic
mainSection.addEventListener("click", (e) => {
  // Check if the clicked element is the start button
  if (e.target.classList.contains("start-button")) {
    // Prevent starting the game if it has already begun
    if (isGameStart === true) return;

    // Validate final setup before starting the game
    let result = finalCheck();

    if (result === "pass") {
      // Mark game as started and update button state
      isGameStart = true;
      document.querySelector(".start-button").classList.remove("ready");
      startTimer();
      renderTurn(playerOneData[0].playerName);

      // Remove ship configuration layers from the UI
      let playerOneConfig = document
        .querySelector(".ship-layer-pleyerone")
        .remove();
      let playerTwoConfig;
      if (document.querySelector(".ship-layer-pleyertwo")) {
        playerTwoConfig = document
          .querySelector(".ship-layer-pleyertwo")
          .remove();
      }

      // Store removed configurations for later use
      storePlayerShipConfig = [playerOneConfig, playerTwoConfig];
    }
  }
});

// Highlights a grid cell when a draggable item enters it.
function dragEnter(e) {
  e.preventDefault();
  if (e.target.className === "grid-cell") {
    let x = Number(e.target.dataset.x);
    let y = Number(e.target.dataset.y);
    const gridCellElement = e.target;
    let status = checkShipPlacement(
      [x, y],
      draggedFleet.dataset.length,
      draggedFleet.dataset.axis,
    );
    if (status === "invalid index") {
      gridCellElement.style.boxShadow = "0px 0px 1px 1px #ff646498";
      return;
    } else {
      gridCellElement.style.boxShadow = "0px 0px 1px 1px #64ffdb98";
    }
  }
}

// Removes highlight from a grid cell when the draggable leaves it.
function dragLeave(e) {
  if (e.target.className === "grid-cell") {
    const gridCellElement = e.target;
    gridCellElement.style.boxShadow = "";
  }
}

/**
 * Handles dropping a ship onto the board:
 * - Validates correct player board
 * - Calculates drop position
 * - Places ship in the correct ship layer
 */
function dragDrop(e) {
  e.preventDefault();
  let correctShip;
  let x = Number(e.target.dataset.x);
  let y = Number(e.target.dataset.y);
  if (
    checkShipPlacement(
      [x, y],
      draggedFleet.dataset.length,
      draggedFleet.dataset.axis,
    ) === "invalid index"
  ) {
    e.target.style.boxShadow = "";
    return;
  }
  draggedFleet.dataset.x = e.target.dataset.x;
  draggedFleet.dataset.y = e.target.dataset.y;
  // Determine which board is targeted
  const isPlayerOneBoard = e.target.closest(".playerone-grid");
  const isPlayerTwoBoard = e.target.closest(".playertwo-grid");

  // Validate ship belongs to correct player
  if (isPlayerOneBoard) {
    correctShip = draggedFleet.classList.contains("playerone");
  }
  if (isPlayerTwoBoard) {
    correctShip = draggedFleet.classList.contains("playertwo");
  }

  // Get target grid cell
  const cell = e.target.closest(".grid-cell");
  if (!cell) return;

  // Remove highlight
  cell.style.boxShadow = "";

  // Stop if wrong ship
  if (!correctShip) return;

  // Get boards and ship layers
  const playerOneBoard = document.querySelector(".playerone-gameboard-wrapper");
  const playerTwoBoard = document.querySelector(".playertwo-gameboard-wrapper");
  const shipLayerPlayerOne = playerOneBoard.querySelector(
    ".ship-layer-pleyerone",
  );
  const shipLayerPlayerTwo = playerTwoBoard.querySelector(
    ".ship-layer-pleyertwo",
  );

  // Get positions for placement
  const rectOne = playerOneBoard.getBoundingClientRect();
  const rectTwo = playerTwoBoard.getBoundingClientRect();
  const cellRect = cell.getBoundingClientRect();

  const offsetOneX = cellRect.left - rectOne.left;
  const offsetOneY = cellRect.top - rectOne.top;
  const offsetTwoX = cellRect.left - rectTwo.left;
  const offsetTwoY = cellRect.top - rectTwo.top;

  // Place ship on Player One board
  if (isPlayerOneBoard) {
    let result = placeShipForPlayer(
      "playerOne",
      draggedFleet,
      [x, y],
      draggedFleet.dataset.axis,
    );
    if (result === "overlap") return;
    shipLayerPlayerOne.appendChild(draggedFleet);
    draggedFleet.style.position = "absolute";
    draggedFleet.style.left = `${offsetOneX}px`;
    draggedFleet.style.top = `${offsetOneY}px`;
  }

  // Place ship on Player Two board
  if (isPlayerTwoBoard) {
    let result = placeShipForPlayer(
      "playerTwo",
      draggedFleet,
      [x, y],
      draggedFleet.dataset.axis,
    );
    if (result === "overlap") return;
    shipLayerPlayerTwo.appendChild(draggedFleet);
    draggedFleet.style.position = "absolute";
    draggedFleet.style.left = `${offsetTwoX}px`;
    draggedFleet.style.top = `${offsetTwoY}px`;
  }
  e.target.style.boxShadow = "";
  if (finalCheck() === "pass") {
    document.querySelector(".start-button").classList.add("ready");
  }
}

// Starts a game timer that updates every second and displays elapsed time in the UI
function startTimer() {
  const startTime = Date.now();

  intervalId = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);

    sec = String(elapsed % 60).padStart(2, "0");
    min = String(Math.floor(elapsed / 60) % 60).padStart(2, "0");
    hour = String(Math.floor(elapsed / 3600)).padStart(2, "0");

    document.querySelector(".start-button").textContent =
      `${hour}:${min}:${sec}`;
  }, 1000);
}

// Positions a computer ship element on the board using grid coordinates and absolute offsets
function appendShipForComputer(ship, coordinate) {
  const playerTwoBoard = document.querySelector(".playertwo-gameboard-wrapper");
  const playerTwoGrid = document.querySelector(".playertwo-grid");
  const shipLayerPlayerTwo = playerTwoBoard.querySelector(
    ".ship-layer-pleyertwo",
  );

  const cell = playerTwoGrid.querySelector(
    `[data-x='${coordinate[0]}'][data-y='${coordinate[1]}']`,
  );

  const rectTwo = playerTwoBoard.getBoundingClientRect();
  const cellRect = cell.getBoundingClientRect();

  const offsetTwoX = cellRect.left - rectTwo.left;
  const offsetTwoY = cellRect.top - rectTwo.top;

  shipLayerPlayerTwo.appendChild(ship);
  ship.style.position = "absolute";
  ship.style.left = `${offsetTwoX}px`;
  ship.style.top = `${offsetTwoY}px`;
}

// Toggles ship rotation between horizontal and vertical while adjusting transform origin for alignment only for computer
function rotateShipForComputer(e) {
  if (e.style.rotate === "90deg") {
    e.style.rotate = "0deg";
    e.dataset.axis = "x";
  } else {
    if (e.classList.contains("img-0")) {
      e.style.transformOrigin = "10% 50%";
    }
    if (e.classList.contains("img-1")) {
      e.style.transformOrigin = "13% 50%";
    }
    if (e.classList.contains("img-2")) {
      e.style.transformOrigin = "17% 50%";
    }
    if (e.classList.contains("img-3")) {
      e.style.transformOrigin = "17% 53%";
    }
    if (e.classList.contains("img-4")) {
      e.style.transformOrigin = "25% 50%";
    }
    e.style.rotate = "90deg";
    e.dataset.axis = "y";
  }
}

// Displays the current player's turn in the UI.
export function renderTurn(playerName) {
  if (!document.querySelector(".player-turn")) {
    const el = document.createElement("p");
    el.classList.add("player-turn");
    mainSection.prepend(el);
  }
  const playerTurn = document.querySelector(".player-turn");
  playerName === "Place Your Fleet"
    ? (playerTurn.textContent = playerName)
    : (playerTurn.textContent = `${playerName}'s Turn`);
}

// Select both player boards
const playerOneBoard = document.querySelector(".playerone-gameboard-wrapper");
const playerTwoBoard = document.querySelector(".playertwo-gameboard-wrapper");

// Attach drag-and-drop event listeners to Player One board
playerOneBoard.addEventListener("drop", (e) => dragDrop(e));
playerOneBoard.addEventListener("dragover", (e) => e.preventDefault());
playerOneBoard.addEventListener("dragenter", (e) => dragEnter(e));
playerOneBoard.addEventListener("dragleave", (e) => dragLeave(e));

// Attach drag-and-drop event listeners to Player Two board
playerTwoBoard.addEventListener("drop", (e) => dragDrop(e));
playerTwoBoard.addEventListener("dragover", (e) => e.preventDefault());
playerTwoBoard.addEventListener("dragenter", (e) => dragEnter(e));
playerTwoBoard.addEventListener("dragleave", (e) => dragLeave(e));

renderPlayersGrid();
