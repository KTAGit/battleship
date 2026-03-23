import { Ship, Gameboard, Player } from "../logic";

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

describe("Creates a gameboard object", () => {
  test("Checks if ship goes outside the board x-axis", () => {
    const ship = new Ship(4);
    const gameboard = new Gameboard();
    expect(gameboard.placeShip(ship, [5, 7], "x")).toBe("invalid index");
  });

  test("Checks if ship goes outside the board y-axis", () => {
    const ship = new Ship(4);
    const gameboard = new Gameboard();
    expect(gameboard.placeShip(ship, [8, 5], "y")).toBe("invalid index");
  });

  test("Checks if ship overlaps with another ship", () => {
    const carrier = new Ship(5);
    const battleship = new Ship(4);
    const gameboard = new Gameboard();
    gameboard.placeShip(carrier, [4, 4], "x");
    expect(gameboard.placeShip(battleship, [4, 6], "x")).toBe("overlap");
  });

  test("Checks duplicate attacks on the same coordinate", () => {
    const gameboard = new Gameboard();
    gameboard.receiveAttack([2, 4]);
    expect(gameboard.receiveAttack([2, 4])).toBe("invalid coordinates");
  });
});

describe("Creates a player object", () => {
  test("Checks the players ship positions", () => {
    const player = new Player("John", "real");
    const carrier = new Ship(5);
    player.gameboard.placeShip(carrier, [4, 4], "y");
    expect(player.gameboard.shipPositions[0].position).toEqual(
      expect.arrayContaining([
        [4, 4],
        [5, 4],
        [6, 4],
        [7, 4],
        [8, 4],
      ]),
    );
  });
});
