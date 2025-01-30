import { CalcState } from "types/calcTypes";

export const trigonometricHandler = (
  operation: string,
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>
) => {
  const value = calc.num || calc.res;
  let result = 0;

  switch (operation) {
    case "sin":
      result = Math.sin(value);
      break;
    case "cos":
      result = Math.cos(value);
      break;
    case "tan":
      result = Math.tan(value);
      break;
  }
  setCalc({
    ...calc,
    num: result,
    res: result,
    expression: `${operation}(${value}) = ${result}`,
  });
};

export const logarithmHandler = (
  operation: string,
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>
) => {
  const value = calc.num || calc.res;
  const result = operation === "log" ? Math.log10(value) : Math.log(value);

  setCalc({
    ...calc,
    num: result,
    res: result,
    expression: `${operation}(${value}) = ${result}`,
  });
};

export const angleUnitHandler = (
  operation: string,
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>
) => {
  const value = calc.num || calc.res;
  let result: number;

  if (operation === "rad") {
    result = value * (Math.PI / 180);
  } else {
    result = value * (180 / Math.PI);
  }

  setCalc({
    ...calc,
    num: result,
    res: result,
    expression: `${operation}(${value}) = ${result}`,
  });
};

export const powerHandler = (
  exponent: number,
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>
) => {
  const base = calc.num || calc.res;
  const result = Math.pow(base, exponent);

  let expression = "";
  if (exponent === 2) {
    expression = `${base}² = ${result}`;
  } else {
    expression = `${base}^${exponent} = ${result}`;
  }

  setCalc({
    ...calc,
    num: result,
    res: result,
    expression: expression,
    sign: "",
  });
};

export const rootHandler = (
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>
) => {
  const value = calc.num || calc.res;

  if (value < 0) {
    throw new Error("Cannot calculate square root of negative number");
  }

  const result = Math.sqrt(value);

  setCalc({
    ...calc,
    num: result,
    res: result,
    expression: `√${value} = ${result}`,
    sign: "",
  });
};

export const constantHandler = (
  value: number,
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>
) => {
  const symbol = value === Math.PI ? "π" : "e";
  const result = value;

  setCalc({
    ...calc,
    num: result,
    res: result,
    expression: calc.expression + symbol,
    sign: "",
  });
};

export const factorialHandler = (
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>
) => {
  const value = calc.num || calc.res;

  // Input validation
  if (value < 0 || !Number.isInteger(value)) {
    throw new Error("Factorial only works with positive integers");
  }

  // Calculate factorial
  const calculateFactorial = (n: number): number => {
    if (n === 0 || n === 1) return 1;
    return n * calculateFactorial(n - 1);
  };

  const result = calculateFactorial(value);

  setCalc({
    ...calc,
    num: result,
    res: result,
    expression: `${value}! = ${result}`,
    sign: "",
  });
};
