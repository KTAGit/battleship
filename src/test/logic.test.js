import { Ship } from "../logic";

describe("Creates ship object", () => {
  test("Checks initial state of isSunk methode", () => {
    const ship = new Ship(4);
    expect(ship.isSunk()).toBeFalsy();
  });
  test("Checks if ship has sunk after ship taking full damage", () => {
    const ship = new Ship(4);
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBeTruthy();
  });
  test("Checks if ship has NOT sunk after taking some damage", () => {
    const ship = new Ship(4);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBeFalsy();
  });
});
