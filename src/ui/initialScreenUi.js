export function toggleSelection(select) {
  const playerVsPlayer = document.querySelector("#p-vs-p");
  const playerVsComputer = document.querySelector("#p-vs-c");
  if (select === "playerVsPlayer") {
    playerVsPlayer.classList.add("selected");
    playerVsComputer.classList.remove("selected");
    document.querySelector("#player-two-input").value = "";
    removeInputField("on");
  }
  if (select === "playerVsComputer") {
    playerVsComputer.classList.add("selected");
    playerVsPlayer.classList.remove("selected");
    removeInputField("off");
    document.querySelector("#player-two-input").value = "computer";
  }
}

function removeInputField(action) {
  const playerTwoInputField = document.querySelector(
    ".player-two-input-wrapper",
  );
  action === "off"
    ? (playerTwoInputField.style.display = "none")
    : (playerTwoInputField.style.display = "flex");
}

export function removeInitialScreen() {
  const tint = document.querySelector(".tint");
  const form = document.querySelector(".initial-screen");
  tint.style.display = "none";
  form.style.display = "none";
}
