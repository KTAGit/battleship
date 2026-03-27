import battleship from "../assets/Battleship.png";
import carrier from "../assets/carrier.png";
import destroyer from "../assets/destroyer.png";
import submarine from "../assets/submarine.png";
import patrolBoat from "../assets/patrol-boat.png";

// Array containing all fleet ship image sources
const fleet = [carrier, battleship, destroyer, submarine, patrolBoat];

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
