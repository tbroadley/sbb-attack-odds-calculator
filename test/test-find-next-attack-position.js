const { expect } = require("chai");

const { findNextAttackPosition } = require("../index");
const { units } = require("./test-helpers");

describe("findNextAttackPosition", () => {
  it("returns -1 if there are no units", () => {
    expect(findNextAttackPosition(units("0 0 0 0"), -1)).to.equal(-1);
  });

  it("returns -1 if there are no units in front of the current attack position", () => {
    expect(findNextAttackPosition(units("1 1 0 0"), 1)).to.equal(-1);
  });

  it("returns the next unit if it can attack", () => {
    expect(findNextAttackPosition(units("1 1 0 0"), 0)).to.equal(1);
  });

  it("skips units that can't attack", () => {
    expect(findNextAttackPosition(units("1 0 0 1"), 0)).to.equal(3);
  });

  it("can find the first unit if the current nextAttackPosition is -1", () => {
    expect(findNextAttackPosition(units("1 0 0 1"), -1)).to.equal(0);
  });
});
