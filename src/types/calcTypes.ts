import React from "react";

export interface CalcState {
  sign: string;
  num: number;
  res: number | string;
}

export type CalcAction = {
  type: "SET_NUMBER" | "SET_SIGN" | "CALCULATE" | "RESET" | "BACKSPACE";
  payload?: any;
};

export type CalcHandler = (
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>
) => void;

export interface SyntheticButtonEvent {
  currentTarget: {
    innerHTML: string;
  };
  target: {
    innerHTML: string;
  }
  preventDefault: () => void;
}