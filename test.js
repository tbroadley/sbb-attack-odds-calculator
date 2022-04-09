const { expect } = require('chai');

const { parseUnit, randUnitPosition, findNextAttackPosition } = require('./index');

describe("parseUnit", () => {
	it("parses a basic unit", () => {
		expect(parseUnit("1")).to.deep.equal({ attacksLeft: 1, ranged: false, resummon: false });
	});

	it("parses a ranged unit", () => {
		expect(parseUnit("2R")).to.deep.equal({ attacksLeft: 2, ranged: true, resummon: false });
	});

	it("parses a resummon unit", () => {
		expect(parseUnit("3S")).to.deep.equal({ attacksLeft: 3, ranged: false, resummon: true });
	});

	it("parses an empty slot", () => {
		expect(parseUnit("0")).to.deep.equal({ attacksLeft: 0, ranged: false, resummon: false });
	});
});

describe("randUnitPosition", () => {
	it("returns -1 if there are no units", () => {
		const units = "0 0 0 0".split(' ').map(parseUnit);
		expect(randUnitPosition(units)).to.equal(-1);
	})

	it("returns the unit's position if a single unit exists", () => {
		const units = "0 1 0 0".split(' ').map(parseUnit);
		expect(randUnitPosition(units)).to.equal(1);
	})
});
