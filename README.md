# sbb-attack-odds-calculator

Given a configuration of units in the front row of a Storybook Brawl board, this tool approximates the probability of each front-row unit attacking.

## Examples

You want to figure out how likely it is that your White Stag, Chupacabra, or Copycat will attack if you put it in position 2.

```
> yarn run start --units "1 1 1 1"
[0.8816, 0.5752, 0.3538, 0.1854]
```

So roughly 56%.

What if the unit in position 1 is ranged?

```
> yarn run start --units "1R 1 1 1"
[0.8791, 0.6675, 0.4297, 0.3353]
```

Roughly 67%, or 2/3.

## Prerequisites

- Node.js
- yarn

## Setup

```shell
yarn
```

## Running

```shell
yarn run start --units "1 1 1 1" --runs 10000 --debug
```

`--units` is a string containing four unit descriptions separated by single spaces. A unit description starts with a single digit (0-9) describing how many times the unit can attack or be attacked before it dies. Optionally, you can append "R" to a digit to make the unit ranged, or "S" to make it resummon once.

Here are a few valid `--units` arguments:

```
2 1 1 1
1R 1 1 1
1 1 1S 1S
3 2 2 1
0 1 1 1
1 1 0 0
```

The program uses the Monte Carlo method to approximate the chances of each unit attacking. `--runs` is the number of Monte Carlo simulations the program will do.

`--debug` enables extra debug printing.

The program prints an array of four numbers to stdout. The first number of the array is the likelihood that the first unit will attack, the second number the likelihood for the second unit, etc.

## Known limitations

- The output contains the combined attack probabilities of ALL the units that could attack from that slot, not just the unit that started in that slot. For units that resummon, this means that the output contains the attack probability of the original unit PLUS the attack probability of the resummoned unit
- Doesn't allow simulating units that resummon multiple units (Princess Peep, Baby Bear, and Three Big Pigs)
- Assumes that all resummoned units have enough health to attack or be attacked once. Doesn't take into account that they might have enough health to survive 2+ attacks
- Doesn't take into account Reduplicator, Mirror Mirror, Muerte's or Mordred's hero power, etc.
