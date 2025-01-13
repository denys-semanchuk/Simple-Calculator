import React from "react";
import { CalcState, CalcHandler } from "../types/calcTypes.ts";
import { removeSpaces, toLocaleString } from "./calculatorHandlers.ts";
import { keyboardMap } from "./keyboardMap.ts";

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
  e: React.MouseEvent<HTMLButtonElement>,
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>
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
  }
};

const commaClickHandler = (
  e: React.MouseEvent<HTMLButtonElement>,
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>
) => {
  const value = e.target.innerHTML;

  setCalc({
    ...calc,
    num: !calc.num.toString().includes(".") ? calc.num + value : calc.num,
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
  let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
  let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;

  setCalc({
    ...calc,
    num: (num /= Math.pow(100, 1)),
    res: (res /= Math.pow(100, 1)),
    sign: "",
  });
};

const handleKeyboard = (
  e: KeyboardEvent,
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>
) => {
  if (/^\d$/.test(e.key)) {
      numClickHandler({ ...e, target: { innerHTML: e.key } }, calc, setCalc);
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
        equalsClickHandler(calc, setCalc);
        break;
      case "/":
      case "X":
      case "-":
      case "+":
        signClickHandler(
          { ...e, target: { innerHTML: mappedKey } },
          calc,
          setCalc
        );
        break;
      case ".":
        commaClickHandler(
          { ...e, target: { innerHTML: mappedKey } },
          calc,
          setCalc
        );
        break;
    }
  }
};

const equalsClickHandler = (
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>
) => {
  if (calc.sign && calc.num) {
    const math = (a, b, sign) =>
      sign === "+"
        ? a + b
        : sign === "-"
        ? a - b
        : sign === "X"
        ? a * b
        : a / b;

    setCalc({
      ...calc,
      res:
        String(calc.num) === "0" && calc.sign === "/"
          ? "Can't divide with 0"
          : toLocaleString(
              math(
                Number(removeSpaces(calc.res)),
                Number(removeSpaces(calc.num)),
                calc.sign
              )
            ),
      sign: "",
      num: 0,
    });
  }
};

const signClickHandler = (
  e: React.MouseEvent<HTMLButtonElement>,
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
