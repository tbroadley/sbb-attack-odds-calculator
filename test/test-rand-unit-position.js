const { expect } = require("chai");

const { randUnitPosition } = require("../index");
const { units } = require("./test-helpers");

describe("randUnitPosition", () => {
  it("returns -1 if there are no units", () => {
    expect(randUnitPosition(units("0 0 0 0"))).to.equal(-1);
  });

  it("returns the unit's position if a single unit exists", () => {
    expect(randUnitPosition(units("0 1 0 0"))).to.equal(1);
  });
});
