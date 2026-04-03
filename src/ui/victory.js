import medal from "../assets/Medal-icon.png";

export function announceVictory(player, stats) {}

// const victoryPopUp = document.querySelector(".victory-section").remove();
document.querySelector(".initial-screen").remove();

const medalIcon = document.createElement("img");
medalIcon.src = medal;
medalIcon.classList.add("medal-icon");
document.querySelector(".badge-wrapper").appendChild(medalIcon);
