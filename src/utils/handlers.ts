import React from "react";
import {
  CalcState,
  CalcHandler,
  SyntheticButtonEvent,
  Operation,
} from "types/calcTypes";
import { removeSpaces } from "./calculatorHandlers";
import { keyboardMap } from "./keyboardMap";
import { ErrorState, ErrorType } from "types/errTypes";
import { HistoryItem } from "types/historyTypes";
import { calculateOperations } from "./calculateOperations";
import { calculateExpression } from "./calculateExpression";
import { saveLastResult } from "./storageHandlers";

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
      expression:
        calc.expression.length === 1 ? "0" : calc.expression.slice(0, -1),
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
    if (!(calc && calc !== null)) return;

    const operations: Operation[] = calculateOperations(calc);
    const result = calculateExpression(operations);
    saveLastResult(result, calc.expression);
    addToHistory({
      expression: `${calc.res} ${calc.sign} ${calc.num}`,
      result,
      timestamp: new Date(),
    });

    setCalc({
      ...calc,
      sign: "",
      num: 0,
      res: result,
      expression: `${calc.expression} = ${result}`,
      brackets: { count: 0, expressions: [] },
      equalsClicked: true,
    });
  } catch (err) {
    console.log(err);
    throw new Error("Invalid calculation");
  }
};

const signClickHandler = (
  e: SyntheticButtonEvent,
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>
) => {
  const value = e.currentTarget.innerHTML;
  let newExpression = calc.expression;
  if (isOperator(calc.expression)) newExpression = calc.expression.slice(0, -2);
  setCalc({
    ...calc,
    sign: value,
    res: !calc.res && calc.num ? calc.num : calc.res,
    num: 0,
    expression:
      calc.res && calc.expression !== "" && calc.equalsClicked
        ? `${calc.res} ${value}`
        : `${newExpression} ${value}`,
    equalsClicked: false,
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
  const updatedExpression = calc.expression + ")";

  setCalc({
    ...calc,
    brackets: {
      count: calc.brackets.count - 1,
      expressions: calc.brackets.expressions.slice(-1),
    },
    expression: updatedExpression,
  });
};

const isOperator = (value: string): boolean => {
  const str = value.trimEnd();
  const operatorRegex = /[+\-X/]$/;
  return operatorRegex.test(str[str.length - 1]);
};

const commaClickHandler = (
  e: SyntheticButtonEvent,
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>
) => {
  const value = e.currentTarget.innerHTML;

  if (!calc.num.toString().includes(".")) {
    setCalc({
      ...calc,
      num: calc.num.toString() + ".",
      expression: calc.expression + value,
    });
  }
};
export {
  backspaceHandler,
  numClickHandler,
  resetClickHandler,
  handleKeyboard,
  percentClickHandler,
  equalsClickHandler,
  signClickHandler,
  commaClickHandler,
};
