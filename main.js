const { readFileSync } = require('fs');

const yargs = require('yargs/yargs');

const argv = yargs(process.argv).argv;

const UNITS = argv.units.split(' ').map(parseUnit);
const RUNS = argv.runs ? Number(argv.runs) : 10000;
const DEBUG = !!argv.debug;

function debug(...args) {
	if (DEBUG) {
		console.error(...args);
	}
}

function parseUnit(string) {
	return { 
		attacksLeft: Number(string[0]),
		ranged: string.length > 1 && string[1] === 'R',
		resummon: string.length > 1 && string[1] === 'S',
	};
}

function clone(unit) {
	return { attacksLeft: unit.attacksLeft, ranged: unit.ranged, resummon: unit.resummon };
}

function rand(threshold) {
	return Math.random() < threshold;
}

function randUnitPosition(units) {
	const unitsWithIndices = units.map((unit, index) => ({ ...unit, index }));
	const aliveUnits = unitsWithIndices.filter(it => it.attacksLeft > 0);
	if (aliveUnits.length === 0) return -1;

	const aliveUnitIndex = Math.floor(Math.random() * aliveUnits.length);
	return aliveUnits[aliveUnitIndex].index;
}

function findNextAttackPosition(units, nextAttackPosition) {
	return units.findIndex((unit, index) => index > nextAttackPosition && unit.attacksLeft > 0);
}

function simulateRun(units) {
	const result = [0, 0, 0, 0];
	if (units.every(it => it.attacksLeft <= 0)) {
		return result;
	}

	let nextAttackPosition = findNextAttackPosition(units, -1);
	if (nextAttackPosition === -1) return result;

	const enemyAttacks = rand(0.5);
	if (enemyAttacks) {
		// Defend
		debug("Defending", units, nextAttackPosition);

		const attackedPosition = randUnitPosition(units);
		const unit = units[attackedPosition];
		if (unit.attacksLeft > 0) {
			unit.attacksLeft -= 1;
		}
		if (unit.attacksLeft === 0 && attackedPosition === nextAttackPosition) {
			nextAttackPosition = findNextAttackPosition(units, nextAttackPosition);
			if (nextAttackPosition === -1) return result;
		}
		if (unit.attacksLeft === 0 && unit.resummon) {
			unit.attacksLeft = 1;
			unit.resummon = false;
		}
	}

	while (units.some(it => it.attacksLeft > 0) && nextAttackPosition < 4) {
		// Attack
		debug("Attacking", units, nextAttackPosition);

		const attacker = units[nextAttackPosition];
		if (attacker.attacksLeft <= 0) {
			throw Error('Unit with no attacks left is attacking');
		}

		if (!attacker.ranged) {
			attacker.attacksLeft -= 1;
		}

		if (attacker.attacksLeft === 0 && attacker.resummon) {
			attacker.attacksLeft = 1;
			attacker.resummon = false;
		}

		result[nextAttackPosition] += 1;

		if (!attacker.resummon) {
			nextAttackPosition = findNextAttackPosition(units, nextAttackPosition);
			if (nextAttackPosition === -1) break;
		}

		// Defend
		debug("Defending", units, nextAttackPosition);

		const attackedPosition = randUnitPosition(units);
		if (randUnitPosition === -1) break;

		const unit = units[attackedPosition];
		if (unit.attacksLeft > 0) {
			unit.attacksLeft -= 1;
		}
		if (unit.attacksLeft === 0 && attackedPosition === nextAttackPosition) {
			nextAttackPosition = findNextAttackPosition(units, nextAttackPosition);
			if (nextAttackPosition === -1) break;
		}
		if (unit.attacksLeft === 0 && unit.resummon) {
			unit.attacksLeft = 1;
			unit.resummon = false;
		}
	}

	return result;
}

if (UNITS.length != 4) process.exit(1);

const outcomes = [0, 0, 0, 0];
for (let i = 0; i < RUNS; i += 1) {
	debug(`Run ${i + 1}`)
	const result = simulateRun(UNITS.map(clone));

	for (let j = 0; j < result.length; j += 1) {
		outcomes[j] += result[j];
	}
}

console.log(outcomes.map(it => it / RUNS));
