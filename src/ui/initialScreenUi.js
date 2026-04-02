// Toggles between game modes and updates UI accordingly
export function toggleSelection(select) {
  const playerVsPlayer = document.querySelector("#p-vs-p");
  const playerVsComputer = document.querySelector("#p-vs-c");
  if (select === "playerVsPlayer") {
    // Highlight PvP option and reset player two input
    playerVsPlayer.classList.add("selected");
    playerVsComputer.classList.remove("selected");
    document.querySelector("#player-two-input").value = "";
    removeInputField("on");
  }
  if (select === "playerVsComputer") {
    // Highlight PvC option, hide player two input, and set it to "computer"
    playerVsComputer.classList.add("selected");
    playerVsPlayer.classList.remove("selected");
    removeInputField("off");
    document.querySelector("#player-two-input").value = "computer";
  }
}

// Shows or hides the player two input field based on the action
function removeInputField(action) {
  const playerTwoInputField = document.querySelector(
    ".player-two-input-wrapper",
  );
  action === "off"
    ? (playerTwoInputField.style.display = "none")
    : (playerTwoInputField.style.display = "flex");
}

// Removes the initial setup screen from view
export function removeInitialScreen() {
  const tint = document.querySelector(".tint");
  const form = document.querySelector(".initial-screen");

  tint.style.display = "none";
  form.style.display = "none";
}

// Creates and inserts a "Start Game" button at the top of the main section
export function generateStartButton() {
  const mainSection = document.querySelector(".main-section");
  const startBtn = document.createElement("button");

  startBtn.textContent = "START GAME";
  startBtn.classList.add("start-button");

  mainSection.prepend(startBtn);
}
