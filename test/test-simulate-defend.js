const { expect } = require("chai");

const { simulateDefend } = require("../index");
const { units } = require("./test-helpers");

describe("simulateDefend", () => {
  it("throws an error when trying to attack a nonexistent unit", () => {
    expect(() => simulateDefend(units("0 1 1 1"), 1, 0)).to.throw(Error);
  });

  it("returns -1 if there are no units that can make attacks", () => {
    const unitsArray = units("1 0 0 0");
    expect(simulateDefend(unitsArray, 0, 0)).to.deep.equal({
      newNextAttackPosition: -1,
    });
    expect(unitsArray).to.deep.equal(units("0 0 0 0"));
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

  it("handles resummons", () => {
    const unitsArray = units("1 1S 1R 1S");
    expect(simulateDefend(unitsArray, 0, 1)).to.deep.equal({
      newNextAttackPosition: 0,
    });
    expect(unitsArray).to.deep.equal(units("1 1 1R 1S"));
  });

  it("updates newNextAttackPosition when unit in nextAttackPosition is attacked and dies", () => {
    const unitsArray = units("1 1S 1R 1S");
    expect(simulateDefend(unitsArray, 2, 2)).to.deep.equal({
      newNextAttackPosition: 3,
    });
    expect(unitsArray).to.deep.equal(units("1 1S 0R 1S"));
  });

  it("doesn't update newNextAttackPosition when unit in nextAttackPosition is attacked and survives", () => {
    const unitsArray = units("1 2 1R 1S");
    expect(simulateDefend(unitsArray, 1, 1)).to.deep.equal({
      newNextAttackPosition: 1,
    });
    expect(unitsArray).to.deep.equal(units("1 1 1R 1S"));
  });

  it("doesn't update newNextAttackPosition when ranged unit in nextAttackPosition is attacked and survives", () => {
    const unitsArray = units("1 2R 1R 1S");
    expect(simulateDefend(unitsArray, 1, 1)).to.deep.equal({
      newNextAttackPosition: 1,
    });
    expect(unitsArray).to.deep.equal(units("1 1R 1R 1S"));
  });

  it("doesn't update newNextAttackPosition when unit in nextAttackPosition is attacked and resummons", () => {
    const unitsArray = units("1 2R 1R 1S");
    expect(simulateDefend(unitsArray, 3, 3)).to.deep.equal({
      newNextAttackPosition: 3,
    });
    expect(unitsArray).to.deep.equal(units("1 2R 1R 1"));
  });

  it("returns -1 if there are no units that can make attacks ahead of nextAttackPosition", () => {
    const unitsArray = units("1 1 0 0");
    expect(simulateDefend(unitsArray, 1, 1)).to.deep.equal({
      newNextAttackPosition: -1,
    });
    expect(unitsArray).to.deep.equal(units("1 0 0 0"));
  });
});
