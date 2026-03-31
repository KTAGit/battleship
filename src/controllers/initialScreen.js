import { initiateNewGame } from "./controller";
import { toggleSelection } from "../ui/initialScreenUi";
import { removeInitialScreen } from "../ui/initialScreenUi";
let currentSetting = "playerVsPlayer";

function getUsername() {
  const playerOneUsername = document.querySelector("#player-one-input").value;
  const playerTwoUsername = document.querySelector("#player-two-input").value;
  if (currentSetting === "playerVsPlayer") {
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
    if (!playerOneUsername) {
      initiateNewGame("Player 1", playerTwoUsername);
    } else {
      initiateNewGame(playerOneUsername, playerTwoUsername);
    }
  }
}

document.querySelector("#p-vs-p").addEventListener("click", (e) => {
  e.preventDefault();
  currentSetting = "playerVsPlayer";
  toggleSelection("playerVsPlayer");
});

document.querySelector("#p-vs-c").addEventListener("click", (e) => {
  e.preventDefault();
  currentSetting = "playerVsComputer";
  toggleSelection("playerVsComputer");
});

document.querySelector("#submit-btn").addEventListener("click", (e) => {
  e.preventDefault();
  getUsername();
  removeInitialScreen();
});
