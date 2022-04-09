const { parseUnit } = require("../index");

function units(s) {
  return s.split(" ").map(parseUnit);
}

module.exports = { units };
