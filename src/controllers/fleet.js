import battleship from "../assets/Battleship.png";
import carrier from "../assets/carrier.png";
import destroyer from "../assets/destroyer.png";
import submarine from "../assets/submarine.png";
import patrolBoat from "../assets/patrol-boat.png";
import { checkShipPlacement, placeShipForPlayer } from "./controller";

// Array containing all fleet ship image sources
const fleet = [carrier, battleship, destroyer, submarine, patrolBoat];
const fleetName = [
  ["carrier", 5],
  ["battleship", 4],
  ["destroyer", 3],
  ["submarine", 3],
  ["patrol-boat", 2],
];

// DOM references for player fleet containers and ship layers
const playerOneContainer = document.querySelector(".playerone-fleet-container");
const playerTwoContainer = document.querySelector(".playertwo-fleet-container");
const playerOneShipLayer = document.querySelector(".ship-layer-pleyerone");
const playerTwoShipLayer = document.querySelector(".ship-layer-pleyertwo");

// Stores the currently dragged ship element
export let draggedFleet = null;

// Generate fleet ships and render them in the container
function generateFleets(player, container) {
  fleet.forEach((src, index) => {
    const img = document.createElement("img");
    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add(`fleet-img-${index}-wrapper`);
    img.src = src;
    img.classList.add(`img-${index}`);
    img.classList.add(player);
    img.dataset.axis = "x";
    img.dataset.name = fleetName[index][0];
    img.dataset.length = fleetName[index][1];
    imgWrapper.appendChild(img);
    container.appendChild(imgWrapper);
  });
}

// Generate fleet for Player One
generateFleets("playerone", playerOneContainer);
// Generate fleet for Player Two
generateFleets("playertwo", playerTwoContainer);

/**
 * Rotates a ship between horizontal (x) and vertical (y) axis
 * and adjusts transform origin based on ship size
 */
function rotateShip(e) {
  let x = Number(e.target.dataset.x);
  let y = Number(e.target.dataset.y);
  let length = Number(e.target.dataset.length);
  let axis = e.target.dataset.axis;
  let player = e.target.classList.contains("playerone")
    ? "playerOne"
    : "playerTwo";

  axis === "x" ? (axis = "y") : (axis = "x");

  let result = placeShipForPlayer(player, e.target, [x, y], axis);
  if (result === "overlap") return;
  if (checkShipPlacement([x, y], length, axis) === "invalid index") {
    return;
  }
  if (e.target.style.rotate === "90deg") {
    e.target.style.rotate = "0deg";
    e.target.dataset.axis = "x";
  } else {
    if (e.target.classList.contains("img-0")) {
      e.target.style.transformOrigin = "10% 50%";
    }
    if (e.target.classList.contains("img-1")) {
      e.target.style.transformOrigin = "13% 50%";
    }
    if (e.target.classList.contains("img-2")) {
      e.target.style.transformOrigin = "17% 50%";
    }
    if (e.target.classList.contains("img-3")) {
      e.target.style.transformOrigin = "17% 53%";
    }
    if (e.target.classList.contains("img-4")) {
      e.target.style.transformOrigin = "25% 50%";
    }
    e.target.style.rotate = "90deg";
    e.target.dataset.axis = "y";
  }
}

// Validates whether both players have placed the required number of ships
export function finalCheck() {
  const requirement = 5;

  // Count ships placed on each player's board
  const pOneShipOnBoardCount = playerOneShipLayer.childElementCount;
  const pTwoShipOnBoardCount = playerTwoShipLayer.childElementCount;

  // Check if both players meet the required number of ships
  if (
    pOneShipOnBoardCount === requirement &&
    pTwoShipOnBoardCount === requirement
  ) {
    return "pass"; // All requirements met
  }
  return "fail"; // One or both players are missing ships
}

// Allow rotating ships by clicking on them (Player One layer)
playerOneShipLayer.addEventListener("click", (e) => {
  rotateShip(e);
});

// Allow rotating ships by clicking on them (Player Two layer)
playerTwoShipLayer.addEventListener("click", (e) => {
  rotateShip(e);
});

// Tracks the currently dragged ship element globally
document.addEventListener("drag", (e) => {
  if (e.target.tagName === "IMG") {
    draggedFleet = e.target;
  }
});
