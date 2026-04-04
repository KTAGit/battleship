import medal from "../assets/Medal-icon.png";
import { intervalId, sec, min, hour } from "./renderGameboard";

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
  tint.appendChild(victoryPopUp);
}

// Creates and appends a medal icon to the victory popup
function renderMedalIcon() {
  const medalIcon = document.createElement("img");
  medalIcon.src = medal;
  medalIcon.classList.add("medal-icon");
  victoryPopUp.querySelector(".badge-wrapper").appendChild(medalIcon);
}
