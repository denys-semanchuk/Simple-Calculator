import { CalcState, Operation } from "types/calcTypes";

export const calculateOperations = (calc: CalcState) => {
  const operations: Operation[] = [];
  const numbers =
    calc.expression.match(/-?\d+\.?\d*/g)?.map((num) => parseFloat(num)) || [];
  const brackets = calc!.expression!.match(/[\(\)]/g) || [];
  const operators = calc.expression.match(/[\+\-X()\/]/g) || [];

  if (numbers.length > 0) {
    if (brackets.length <= 0)
      operations.push({ operator: "+", value: numbers[0] });
    for (let i = 0; i < operators.length; i++) {
      if (operators[i] === "(" || operators[i] === ")") {
        operations.push({
          operator: operators[i],
          value: 0,
        });
        if (operators[i] === "(") {
          operations.push({
            operator: "",
            value: numbers[i],
          });
          continue;
        } else if (operators[i] === ")") {
          operators.splice(i, 1);
          i--;
        }
        continue;
      }
      operations.push({
        operator: operators[i],
        value: brackets.length > 0 ? numbers[i] : numbers[i + 1],
      });
    }
  }
  return operations;
};
