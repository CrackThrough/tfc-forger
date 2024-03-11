//#region constants
const returnableValues = [-15, -9, -6, -3, 2, 7, 13, 16];
const returnableBiggestPositiveValue = 16;
const cannedSolutions = {
  1: [7, -6],
  2: [2],
  3: [7, -6, 2],
  4: [7, -3],
  5: [13, 7, -15],
  6: [7, -3, 2],
  7: [7],
  8: [7, -6, 7],
  9: [7, 2],
  10: [13, -3],
  11: [13, -9, 7],
  12: [13, -3, 2],
  13: [13],
  14: [13, -6, 7],
  15: [13, 2],
  16: [16],
  17: [13, 2, 2],
  18: [16, 2],
  19: [13, -3, 7, 2],
  20: [13, 7],
  21: [7, 7, 7],
  22: [13, 7, 2],
  23: [16, 7],
  24: [13, 7, 2, 2],
  25: [16, 7, 2],
  26: [13, 13],
  27: [13, 7, 7],
  28: [13, 13, 2],
  29: [16, 13],
  30: [16, 7, 7],
  31: [16, 13, 2],
  32: [16, 16],
  33: [13, 13, 7],
};
//#endregion

//#region utils
const validateSolutionNumber = (number) => {
  return !isNaN(number) && number >= 0 && number <= 150;
};

/**
 * @param {import(".").CalculationCriteria} config
 */
const validateConfig = (config) => {
  const { destinationValue, criteria } = config;

  if (
    !destinationValue || // <-- filter 0
    typeof destinationValue !== "number" ||
    !validateSolutionNumber(destinationValue)
  ) {
    throw new RangeError("destinationValue must be between 1 and 150");
  }

  criteria.forEach((c) => {
    if (!returnableValues.concat("hammer").includes(c))
      throw new TypeError(
        "criteria must be one of [-3, -6, -9, -15, 2, 7, 13, 16, 'hammer']"
      );
  });
};
//#endregion

//#region calculation helpers
/**
 * @param {number} offset
 * @returns {CalculationCriteriaExcludingHammer[]}
 */
const solveOffset = (offset) => {
  // constrains to note: under no events the resulting value in any steps can go negative or exceed 150

  const solutions = [];

  let offsetEffectiveFactor = Math.floor(
    offset / returnableBiggestPositiveValue
  );

  let cannedSolutionTries = Array(3)
    .fill(0)
    .map((_, i) => offsetEffectiveFactor - i)
    .filter((x) => x > 0);

  cannedSolutionTries.forEach((x) => {
    let sol = cannedSolutions[offset - returnableBiggestPositiveValue * x];
    if (sol !== undefined) {
      solutions.push(Array(x).fill(returnableBiggestPositiveValue).concat(sol));
    }
  });

  return solutions.sort((a, b) => a.length - b.length)[0];
};
//#endregion

module.exports = {
  /**
   * @param {import(".").CalculatorConfig} config
   * @returns {import(".").CalculationCriteriaExcludingHammer[]}
   */
  calculate: (config) => {
    validateConfig(config);

    const { destinationValue, criteria } = config;

    let possibleOffsets = [];

    let hammerCount = 0;
    let constantSum = 0;

    // separate the hammer from the rest of the criteria
    criteria.forEach((c) => {
      if (c === "hammer") hammerCount++;
      else constantSum += c;
    });

    // if there are hammer criteria, calculate the possible sums
    if (hammerCount) {
      const hammerValues = [-3, -6, -9];
      let possibleHammerSums = [];

      for (let i = 0; i < hammerCount; i++) {
        for (let j = 0; j < hammerValues.length; j++) {
          // if it's NOT first (we need to do some special trickery)
          if (i) {
            possibleHammerSums
              .filter((s) => s.steps.length == i)
              .forEach((s) => {
                // create space for the next hammer value combination if it's not the last iteration
                if (j + 1 != hammerValues.length)
                  possibleHammerSums.push({
                    steps: s.steps.slice(),
                    value: s.value,
                  });

                // mutate the existing item
                s.steps.push(hammerValues[j]);
                s.value += hammerValues[j];
              });
            // no special actions are required for the first iteration, so we just push the values
          } else {
            possibleHammerSums.push({
              steps: [hammerValues[j]],
              value: hammerValues[j],
            });
          }
        }
      }

      // the reason why i added seemingly overengineered sorts:
      // this is worse performance, yes, but i want a better ux
      // people are not trying to be extra speedy here, and i just want a simple solution
      const getStepFrequency = (item) => {
        const frequency = {};
        let result = 0;

        item.steps.forEach((s) => {
          if (!frequency[s]) frequency[s] = 1;
          else frequency[s]++;

          if (result < frequency[s]) result = frequency[s];
        });

        return result;
      };

      // sort by step frequency so it's easier for the players to follow the steps
      // repeating steps is the best here. [-6 -6 -6] is better than [-6 -3 -9]
      possibleHammerSums = possibleHammerSums.sort(
        (a, b) => getStepFrequency(b) - getStepFrequency(a)
      );

      // remove the duplicate values. not the best code, sorry
      possibleHammerSums = possibleHammerSums.filter(
        (s, index, self) => index === self.findIndex((t) => t.value === s.value)
      );

      // re-sort by value
      possibleHammerSums = possibleHammerSums.sort((a, b) => a.value - b.value);

      possibleOffsets.push(
        ...possibleHammerSums.map((s) => {
          return {
            value: destinationValue - constantSum - s.value,
            steps: s.steps,
          };
        })
      );
    } else {
      possibleOffsets.push({
        value: destinationValue - constantSum,
        steps: criteria.slice(),
      });
    }

    // remove the impossible solutions
    possibleOffsets = possibleOffsets.filter((o) => {
      let sum = o.value;
      if (!validateSolutionNumber(sum)) return false;

      for (let i = 0; i < o.steps.length; i++) {
        sum += o.steps[i];
        if (!validateSolutionNumber(sum)) return false;
      }

      return true;
    });

    // figure out the solution to possibleOffsets
    let solutions = possibleOffsets.map((o) => {
      // fit the hammers into the steps specified in criteria
      if (o.steps.length > 0 && o.steps.length < 3) {
        o.steps = criteria.map((c) => {
          if (c === "hammer") return o.steps.shift();
          return c;
        });
      }

      const offset = o.value;
      delete o.value;

      // now we'll attempt to find the solutions

      // note: you need to push to the array so that result will be reversed correctly
      // most people read left to right, and the criteria is usually written right to left, so reverse it
      o.steps.push(...solveOffset(offset));
      o.steps.reverse();
      return o;
    });

    // return the best solution -- let's go for our "perfectly forged" items!
    solutions = solutions.sort((a, b) => a.steps.length - b.steps.length);
    if (solutions.length) return solutions[0].steps;

    throw new Error("No solution found");
  },
};
