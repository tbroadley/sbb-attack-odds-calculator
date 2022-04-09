const { expect } = require("chai");

const { simulateDefend } = require("../index");
const { units } = require("./test-helpers");

describe("simulateDefend", () => {
  it("throws an error when trying to attack a nonexistent unit", () => {
    expect(() => simulateDefend(units("0 1 1 1"), 1, 0)).to.throw(Error);
  });
});
