import React from "react";
import {
  CalcState,
  CalcHandler,
  SyntheticButtonEvent,
  BracketExpression,
} from "types/calcTypes";
import { removeSpaces } from "./calculatorHandlers";
import { keyboardMap } from "./keyboardMap";
import { ErrorState, ErrorType } from "types/errTypes";
import { HistoryItem } from "types/historyTypes";


interface Operation {
  operator: string;
  value: number;
}


const calculateExpression = (operations: Operation[]): number => {
  let result = operations[0].value;
  let i = 1;

  while (i < operations.length) {
    const op = operations[i].operator;
    const nextVal = operations[i].value;

    if (op === "X" || op === "/") {
      if (op === "X") result *= nextVal;
      if (op === "/") {
        if (nextVal === 0) throw new Error("Division by zero");
        result /= nextVal;
      }
      operations.splice(i - 1, 2);
    } else {
      i++;
    }
  }

  // Second pass: addition and subtraction
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i].operator;
    const val = operations[i].value;

    if (op === "+") result += val;
    if (op === "-") result -= val;
  }

  return result;
};

const createSyntheticEvent = (key: string): SyntheticButtonEvent => ({
  currentTarget: {
    innerHTML: key,
  },
  target: {
    innerHTML: key,
  },
  preventDefault: () => {},
});

const backspaceHandler: CalcHandler = (calc, setCalc) => {
  if (calc.num !== 0) {
    const numStr = calc.num.toString();
    setCalc({
      ...calc,
      num: numStr.length === 1 ? 0 : Number(numStr.slice(0, -1)),
    });
  }
};

const numClickHandler = (
  e: SyntheticButtonEvent,
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>,
  setError: React.Dispatch<React.SetStateAction<ErrorState>>
) => {
  const value = e.target.innerHTML;
  if (removeSpaces(calc.num).length < 16) {
    setCalc({
      ...calc,
      num: Number(`${calc.num}${value}`),
      expression: calc.expression + value,
    });
  } else {
    handleError("Max number of digits reached", "INVALID_INPUT", setError);
  }
};

const commaClickHandler = (
  e: SyntheticButtonEvent,
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>
) => {
  const element = e.target as HTMLButtonElement;
  const value = element.innerHTML;

  setCalc({
    ...calc,
    num: Number(
      !calc.num.toString().includes(".") ? calc.num + value : calc.num
    ),
  });
};

const resetClickHandler = (
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>
) => {
  setCalc({
    ...calc,
    sign: "",
    num: 0,
    res: 0,
    expression: "",
    brackets: {
      count: 0,
      expressions: [],
    },
  });
};

const percentClickHandler = (
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>
) => {
  if (!calc.num || !calc.res) return;

  const baseNumber = parseFloat(removeSpaces(calc.res));
  const percentage = parseFloat(removeSpaces(calc.num));
  const percentValue = (baseNumber * percentage) / 100;

  let result = 0;
  switch (calc.sign) {
    case "+":
      result = baseNumber + percentValue;
      break;
    case "-":
      result = baseNumber - percentValue;
      break;
    case "X":
      result = baseNumber * (percentage / 100);
      break;
    case "/":
      if (percentage === 0) throw new Error("Division by zero");
      result = (baseNumber / percentage) * 100;
      break;
    default:
      result = percentValue;
  }

  setCalc({
    ...calc,
    num: result,
    res: result,
    sign: "",
  });
};
const handleKeyboard = (
  e: KeyboardEvent,
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>,
  setError: React.Dispatch<React.SetStateAction<ErrorState>>,
  addToHistory: (item: HistoryItem) => void
) => {
  if (/^\d$/.test(e.key)) {
    numClickHandler(createSyntheticEvent(e.key), calc, setCalc, setError);
    return;
  }

  const mappedKey = keyboardMap[e.key as keyof typeof keyboardMap];
  if (mappedKey) {
    switch (mappedKey) {
      case "C":
        resetClickHandler(calc, setCalc);
        break;
      case "←":
        backspaceHandler(calc, setCalc);
        break;
      case "%":
        percentClickHandler(calc, setCalc);
        break;
      case "=":
        equalsClickHandler(calc, setCalc, addToHistory);
        break;
      case "/":
      case "X":
      case "-":
      case "+":
        signClickHandler(createSyntheticEvent(mappedKey), calc, setCalc);
        break;
      case ".":
        commaClickHandler(createSyntheticEvent(mappedKey), calc, setCalc);
        break;
    }
  }
};

const equalsClickHandler = (
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>,
  addToHistory: (item: HistoryItem) => void
) => {
  if (!calc.sign && !calc.brackets.count) return;

  try {
    const operations: Operation[] = [];
    const numbers = calc.expression.split(/[\+\-X\/]/).map(Number);
    const operators = calc.expression.match(/[\+\-X\/]/g) || [];

    operations.push({ operator: "+", value: numbers[0] });
    for (let i = 0; i < operators.length; i++) {
      operations.push({
        operator: operators[i],
        value: numbers[i + 1],
      });
    }
    const result = calculateExpression(operations);

    addToHistory({
      expression: `${calc.res} ${calc.sign} ${calc.num}`,
      result,
      timestamp: new Date(),
    });

    setCalc({
      sign: "",
      num: 0,
      res: result,
      expression: `${calc.expression} = ${result}`,
      brackets: { count: 0, expressions: [] },
    });
  } catch (err) {
    throw new Error("Invalid calculation");
  }
};

const calculateResult = (calc: CalcState): number => {
  const num1 = parseFloat(removeSpaces(calc.res));
  const num2 = parseFloat(removeSpaces(calc.num));

  switch (calc.sign) {
    case "+":
      return num1 + num2;
    case "-":
      return num1 - num2;
    case "X":
      return num1 * num2;
    case "/":
      if (num2 === 0) throw new Error("Division by zero");
      return num1 / num2;
    default:
      return num2;
  }
};

const signClickHandler = (
  e: SyntheticButtonEvent,
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>
) => {
  const value = e.currentTarget.innerHTML;

  setCalc({
    ...calc,
    sign: value,
    res: !calc.res && calc.num ? calc.num : calc.res,
    num: 0,
    expression: `${calc.expression} ${value} `,
  });
};

const handleError = (
  message: string,
  type: ErrorType,
  setError: React.Dispatch<React.SetStateAction<ErrorState>>
) => {
  setError({ show: true, message, type });
  setTimeout(() => setError({ show: false, message: "", type: null }), 3000);
};

/**/ /////////////////////////////////////////////////////////////// */
/*Brackets */
const calculateBracketResult = (calc: CalcState): number => {
  if (calc.brackets.count === 0) {
    return calculateResult(calc);
  }

  const lastExpression =
    calc.brackets.expressions[calc.brackets.expressions.length - 1];
  return lastExpression.res;
};
export const openBracketHandler = (
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>
) => {
  const currentExpression = calc.expression + "(";

  setCalc({
    ...calc,
    brackets: {
      count: calc.brackets.count + 1,
      expressions: [
        ...calc.brackets.expressions,
        {
          num: calc.num,
          sign: calc.sign,
          res: calc.res,
          expression: currentExpression,
        },
      ],
    },
    num: 0,
    sign: "",
    res: 0,
    expression: currentExpression,
  });
};

export const closeBracketHandler = (
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>
) => {
  if (calc.brackets.count === 0) return;

  const result = calculateResult(calc);
  const updatedExpression = calc.expression + result + ")";

  setCalc({
    ...calc,
    brackets: {
      count: calc.brackets.count - 1,
      expressions: calc.brackets.expressions.slice(0, -1),
    },
    num: result,
    res: result,
    expression: updatedExpression,
  });
};

export {
  backspaceHandler,
  numClickHandler,
  commaClickHandler,
  resetClickHandler,
  handleKeyboard,
  percentClickHandler,
  equalsClickHandler,
  signClickHandler,
};
