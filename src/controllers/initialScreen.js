import { initiateNewGame, computerPlayer } from "./controller";
import {
  toggleSelection,
  removeInitialScreen,
  generateStartButton,
} from "../ui/initialScreenUi";
import { renderTurn, renderPlayersGrid } from "../ui/renderGameboard";

// Tracks the current game mode (player vs player or player vs computer)
export let currentSetting = "playerVsPlayer";

// Retrieves usernames from input fields and starts a new game
// Falls back to default names if inputs are empty, depending on game mode
function getUsername() {
  const playerOneUsername = document.querySelector("#player-one-input").value;
  const playerTwoUsername = document.querySelector("#player-two-input").value;
  if (currentSetting === "playerVsPlayer") {
    // Handle Player vs Player mode with default officer names
    if (!playerOneUsername && !playerTwoUsername) {
      initiateNewGame("OFFICER 1", "OFFICER 2");
    } else if (!playerOneUsername) {
      initiateNewGame("OFFICER 1", playerTwoUsername);
    } else if (!playerTwoUsername) {
      initiateNewGame(playerTwoUsername, "OFFICER 2");
    } else {
      initiateNewGame(playerOneUsername, playerTwoUsername);
    }
  } else {
    // Handle Player vs Computer mode with a default name for player one
    if (!playerOneUsername) {
      initiateNewGame("Player 1", playerTwoUsername);
    } else {
      initiateNewGame(playerOneUsername, playerTwoUsername);
    }
  }
}

export function checkGameMode() {
  const gameMode = currentSetting;
  if (gameMode === "playerVsComputer") {
    computerPlayer("place your fleet");
  }
}

// Switches to Player vs Player mode when selected
document.querySelector("#p-vs-p").addEventListener("click", (e) => {
  e.preventDefault();
  currentSetting = "playerVsPlayer";
  toggleSelection("playerVsPlayer");
});

// Switches to Player vs Computer mode when selected
document.querySelector("#p-vs-c").addEventListener("click", (e) => {
  e.preventDefault();
  currentSetting = "playerVsComputer";
  toggleSelection("playerVsComputer");
});

// Handles form submission: gets usernames, removes intro screen, and shows start button
document.querySelector("#submit-btn").addEventListener("click", (e) => {
  e.preventDefault();
  getUsername();
  renderPlayersGrid();
  removeInitialScreen();
  generateStartButton();
  renderTurn("Place Your Fleet");
  checkGameMode();
});
