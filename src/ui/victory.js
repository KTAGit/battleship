import medal from "../assets/Medal-icon.png";
import { intervalId, sec, min, hour } from "./renderGameboard";
import {
  renderPlayersGrid,
  storePlayerShipConfig,
  switchGameStatus,
} from "./renderGameboard";
import { generateFleets } from "../controllers/fleet";
import {
  playerOneData,
  playerTwoData,
  initiateNewGame,
  computerPlayer,
} from "../controllers/controller";
import { currentSetting } from "../controllers/initialScreen";

// Selects and initially removes the victory popup from the DOM
const victoryPopUp = document.querySelector(".victory-section");
victoryPopUp.remove();

// Displays the victory screen with player name, stats, accuracy, and elapsed time
export function announceVictory(playerName, stats) {
  renderMedalIcon();
  clearInterval(intervalId);
  victoryPopUp.querySelector(".hit-count").textContent = stats[0];
  victoryPopUp.querySelector(".miss-count").textContent = stats[1];
  victoryPopUp.querySelector(".accuracy-data").textContent =
    `${Math.floor(stats[2])}%`;
  victoryPopUp.querySelector(".player-name").textContent = playerName;
  let time = hour === "00" ? `${min}:${sec}` : `${hour}:${min}:${sec}`;
  victoryPopUp.querySelector(".time").textContent = time;
  const tint = document.querySelector(".tint");
  tint.style.display = "flex";
  const form = document.querySelector(".initial-screen");
  form.style.display = "none";
  tint.appendChild(victoryPopUp);
}

// Creates and appends a medal icon to the victory popup
function renderMedalIcon() {
  const medalIcon = document.createElement("img");
  medalIcon.src = medal;
  medalIcon.classList.add("medal-icon");
  if (victoryPopUp.querySelector(".badge-wrapper").childElementCount > 0)
    return;
  victoryPopUp.querySelector(".badge-wrapper").appendChild(medalIcon);
}

document.querySelector(".tint").addEventListener("click", (e) => {
  if (e.target.classList.contains("play-again-btn")) {
    restartGame();
    if (currentSetting === "playerVsComputer") {
      computerPlayer("place your fleet");
    }
  }
  if (e.target.classList.contains("restart-new-game-btn")) {
    restartGame();
    const tint = document.querySelector(".tint");
    const form = document.querySelector(".initial-screen");
    tint.style.display = "flex";
    form.style.display = "flex";
    victoryPopUp.remove();
  }
});

const playerOneContainer = document.querySelector(".playerone-fleet-container");
const playerTwoContainer = document.querySelector(".playertwo-fleet-container");

// Clears all board, fleet, and UI elements to prepare for a fresh game state
function removeUsedElements() {
  const playerOneShipLayerEl = storePlayerShipConfig[0];
  const playerTwoShipLayerEl = storePlayerShipConfig.at(-1);
  const tint = document.querySelector(".tint");
  playerOneShipLayerEl.replaceChildren();
  playerTwoShipLayerEl.replaceChildren();

  document.querySelector(".playerone-grid").replaceChildren();
  document.querySelector(".playertwo-grid").replaceChildren();
  document.querySelector(".playerone-fleet-container").replaceChildren();
  document.querySelector(".playertwo-fleet-container").replaceChildren();

  tint.style.display = "none";
  appendShipLayer(playerOneShipLayerEl, playerTwoShipLayerEl);
}

// Restarts the game by resetting UI, regenerating fleets, and reinitializing game state
function restartGame() {
  removeUsedElements();
  generateFleets("playerone", playerOneContainer);
  generateFleets("playertwo", playerTwoContainer);
  renderPlayersGrid();
  resetGameComponents();
  victoryPopUp.remove();
}

// Resets game UI text and reinitializes core game components and state
function resetGameComponents() {
  document.querySelector(".start-button").textContent = "START GAME";
  document.querySelector(".player-turn").textContent = "Place Your Fleet";
  switchGameStatus();
  initiateNewGame(playerOneData[0].playerName, playerTwoData[0].playerName);
}

// Reattaches ship layers back into their respective gameboard wrappers
function appendShipLayer(playerOneShipLayer, playerTwoShipLayer) {
  const playerOneWrapper = document.querySelector(
    ".playerone-gameboard-wrapper",
  );
  const playerTwoWrapper = document.querySelector(
    ".playertwo-gameboard-wrapper",
  );
  const playerOneFleetContainer = document.querySelector(
    ".playerone-fleet-container",
  );
  const playerTwoFleetContainer = document.querySelector(
    ".playertwo-fleet-container",
  );
  playerOneWrapper.insertBefore(playerOneShipLayer, playerOneFleetContainer);
  playerTwoWrapper.insertBefore(playerTwoShipLayer, playerTwoFleetContainer);
}

document.query;
