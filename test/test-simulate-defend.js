const { expect } = require("chai");

const { simulateDefend } = require("../index");
const { units } = require("./test-helpers");

describe("simulateDefend", () => {
  it("throws an error when trying to attack a nonexistent unit", () => {
    expect(() => simulateDefend(units("0 1 1 1"), 1, 0)).to.throw(Error);
  });

  it("simulates a simple defend scenario", () => {
    const unitsArray = units("1 1 1 1");
    expect(simulateDefend(unitsArray, 0, 1)).to.deep.equal({
      newNextAttackPosition: 0,
    });
    expect(unitsArray).to.deep.equal(units("1 0 1 1"));
  });

  it("preserves unit attributes", () => {
    const unitsArray = units("1R 1S 1R 1S");
    expect(simulateDefend(unitsArray, 0, 2)).to.deep.equal({
      newNextAttackPosition: 0,
    });
    expect(unitsArray).to.deep.equal(units("1R 1S 0R 1S"));
  });
});
