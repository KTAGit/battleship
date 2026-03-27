import { turnController, trackTurn } from "../controllers/controller";
import { draggedFleet } from "../controllers/fleet";
import { Ship, Player, Gameboard } from "../logic";

// DOM references for both players gameboard containers
const playerOneContainer = document.querySelector(".playerone-grid");
const playeTwoContainer = document.querySelector(".playertwo-grid");

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
function markBoard(action, element) {
  if (action === "hit") {
    element.classList.add("hit");
    element.textContent = "✕";
  } else if (action === "miss") {
    element.classList.add("miss");
    element.textContent = "◦";
  }
}

// Event listener for Player One's board.
playerOneContainer.addEventListener("click", (e) => {
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
  if (trackTurn === null || trackTurn === "playerOne") {
    if (e.target.classList.contains("grid-cell")) {
      const x = Number(e.target.dataset.x);
      const y = Number(e.target.dataset.y);
      markBoard(turnController([x, y]), e.target);
    }
  }
});

// Highlights a grid cell when a draggable item enters it.
function dragEnter(e) {
  e.preventDefault();
  if (e.target.className === "grid-cell") {
    const gridCellElement = e.target;
    gridCellElement.style.boxShadow = "0px 0px 1px 1px #64ffdb98";
    let x = Number(e.target.dataset.x);
    let y = Number(e.target.dataset.y);
    // console.log([x, y]);
  }
}

// Removes highlight from a grid cell when the draggable leaves it.
function dragLeave(e) {
  if (e.target.className === "grid-cell") {
    const gridCellElement = e.target;
    gridCellElement.style.boxShadow = "none";
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
  cell.style.boxShadow = "none";

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
    shipLayerPlayerOne.appendChild(draggedFleet);
    draggedFleet.style.position = "absolute";
    draggedFleet.style.left = `${offsetOneX}px`;
    draggedFleet.style.top = `${offsetOneY}px`;
  }

  // Place ship on Player Two board
  if (isPlayerTwoBoard) {
    shipLayerPlayerTwo.appendChild(draggedFleet);
    draggedFleet.style.position = "absolute";
    draggedFleet.style.left = `${offsetTwoX}px`;
    draggedFleet.style.top = `${offsetTwoY}px`;
  }
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
