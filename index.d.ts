export declare type CalculationCriteriaExcludingHammer =
  | -3
  | -6
  | -9
  | -15
  | 2
  | 7
  | 13
  | 16;

export declare type CalculationCriteria =
  | CalculationCriteriaExcludingHammer
  | "hammer";

export declare type CalculatorAlgorithm = "greedy" | "bruteforce";

export declare interface CalculatorConfig {
  /**
   * 0 < n <= 150
   */
  destinationValue: number;
  criteria: CalculationCriteria[];
}

export declare function calculate(
  config: CalculatorConfig
): CalculationCriteriaExcludingHammer[];
