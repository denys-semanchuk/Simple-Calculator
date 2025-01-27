import React from "react";
import { CalcState, CalcHandler, SyntheticButtonEvent } from "types/calcTypes";
import { removeSpaces, toLocaleString } from "./calculatorHandlers";
import { keyboardMap } from "./keyboardMap";
import { ErrorState, ErrorType } from "types/errTypes";
import { HistoryItem } from "types/historyTypes";

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
      num:
        calc.num === 0 && value === "0"
          ? 0
          : Number(removeSpaces(calc.num + value)),
      res: !calc.sign ? 0 : calc.res,
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
  if (calc.sign && calc.num) {
    const math = (a: number, b: number, sign: string) =>
      sign === "+"
        ? a + b
        : sign === "-"
        ? a - b
        : sign === "X"
        ? a * b
        : a / b;
    const result = calculateResult(calc);
    addToHistory({
      expression: `${calc.res} ${calc.sign} ${calc.num}`,
      result,
      timestamp: new Date(),
    });
    setCalc({
      ...calc,
      res: result,
      sign: "",
      num: 0,
    });
  }
};

const calculateResult = (calc: CalcState): number => {
  let result = 0;
  const num1 = parseFloat(removeSpaces(calc.res));
  const num2 = parseFloat(removeSpaces(calc.num));

  switch (calc.sign) {
    case "+":
      result = num1 + num2;
      break;
    case "-":
      result = num1 - num2;
      break;
    case "X":
      result = num1 * num2;
      break;
    case "/":
      if (num2 === 0) {
        throw new Error("Division by zero");
      }
      result = num1 / num2;
      break;
    case "%":
      result = num1 % num2;
      break;
    default:
      result = num2;
  }

  return Number(result.toFixed(8));
};

const signClickHandler = (
  e: SyntheticButtonEvent,
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>
) => {
  const value = e.target.innerHTML;

  setCalc({
    ...calc,
    sign: value,
    res: !calc.res && calc.num ? calc.num : calc.res,
    num: 0,
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
