const { readFileSync } = require("fs");
const sum = require("lodash/sum");
const yargs = require("yargs/yargs");

function parseUnit(string) {
  return {
    attacksLeft: Number(string[0]),
    ranged: string.length > 1 && string[1] === "R",
    resummon: string.length > 1 && string[1] === "S",
  };
}

function clone(unit) {
  return {
    attacksLeft: unit.attacksLeft,
    ranged: unit.ranged,
    resummon: unit.resummon,
  };
}

function rand(threshold) {
  return Math.random() < threshold;
}

function randUnitPosition(units) {
  const unitsWithIndices = units.map((unit, index) => ({ ...unit, index }));
  const aliveUnits = unitsWithIndices.filter((it) => it.attacksLeft > 0);
  if (aliveUnits.length === 0) return -1;

  const aliveUnitIndex = Math.floor(Math.random() * aliveUnits.length);
  return aliveUnits[aliveUnitIndex].index;
}

function findNextAttackPosition(units, nextAttackPosition) {
  return units.findIndex(
    (unit, index) => index > nextAttackPosition && unit.attacksLeft > 0
  );
}

function simulateDefend(units, nextAttackPosition, attackedPosition) {
  const unit = units[attackedPosition];
  if (unit.attacksLeft <= 0) {
    throw Error("Trying to attack a unit that doesn't exist");
  }

  unit.attacksLeft -= 1;

  const newNextAttackPosition =
    unit.attacksLeft === 0 && attackedPosition === nextAttackPosition
      ? findNextAttackPosition(units, nextAttackPosition)
      : nextAttackPosition;

  if (unit.attacksLeft === 0 && unit.resummon) {
    unit.attacksLeft = 1;
    unit.resummon = false;
  }

  return { newNextAttackPosition };
}

function simulateRun(units) {
  const result = [0, 0, 0, 0];
  if (units.every((it) => it.attacksLeft <= 0)) {
    return result;
  }

  let nextAttackPosition = findNextAttackPosition(units, -1);
  if (nextAttackPosition === -1) return result;

  const enemyAttacks = rand(0.5);
  if (enemyAttacks) {
    const attackedPosition = randUnitPosition(units);
    if (attackedPosition === -1) return result;

    const { newNextAttackPosition } = simulateDefend(
      units,
      nextAttackPosition,
      attackedPosition
    );
    nextAttackPosition = newNextAttackPosition;
    if (nextAttackPosition === -1) return result;
  }

  while (units.some((it) => it.attacksLeft > 0) && nextAttackPosition < 4) {
    const attacker = units[nextAttackPosition];
    if (attacker.attacksLeft <= 0) {
      throw Error("Unit with no attacks left is attacking");
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

    const attackedPosition = randUnitPosition(units);
    if (randUnitPosition === -1) break;

    const { newNextAttackPosition } = simulateDefend(
      units,
      nextAttackPosition,
      attackedPosition
    );
    nextAttackPosition = newNextAttackPosition;
    if (nextAttackPosition === -1) break;
  }

  return result;
}

function main() {
  const argv = yargs(process.argv).argv;

  const UNITS = argv.units.split(" ").map(parseUnit);
  if (UNITS.length != 4) process.exit(1);

  const RUNS = argv.runs ? Number(argv.runs) : 10000;

  const outcomes = [0, 0, 0, 0];
  for (let i = 0; i < RUNS; i += 1) {
    const result = simulateRun(UNITS.map(clone));

    for (let j = 0; j < result.length; j += 1) {
      outcomes[j] += result[j];
    }
  }

  console.log(outcomes.map((it) => it / RUNS));
  console.log(`Total attacks: ${sum(outcomes) / RUNS}`);
}

module.exports = {
  parseUnit,
  randUnitPosition,
  findNextAttackPosition,
  main,
};
