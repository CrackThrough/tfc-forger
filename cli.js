const calculator = require(".");

/**
 * @type {calculator.CalculatorConfig}
 */
const config = {
  destinationValue: 0,
  criteria: [],
};

const args = process.argv.slice(2);

if (!args.length || args.some((x) => x === "-h" || x === "--help")) {
  console.log("Usage: node cli [flags] <destinationValue> <...criteria>");
  console.log("  destinationValue: number");
  console.log("  criteria: number | hammer");
  console.log("  -- FLAGS --");
  console.log("  -h, --help: show this help");
  process.exit(0);
}

args.slice(0, 4).forEach((arg, index) => {
  if (index === 0) {
    config.destinationValue = Number(arg);
  } else {
    config.criteria.push(
      ["hammer", "h"].includes(arg) ? "hammer" : Number(arg)
    );
  }
});

const result = calculator.calculate(config);
console.log(result);
