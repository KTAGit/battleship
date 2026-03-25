import { turnController, trackTurn } from "../controllers/controller";
import { Ship, Player, Gameboard } from "../logic";

// DOM references for both players gameboard containers
const playerOneContainer = document.querySelector(
  ".playerone-gameboard-wrapper",
);
const playeTwoContainer = document.querySelector(
  ".playertwo-gameboard-wrapper",
);

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

renderPlayersGrid();
