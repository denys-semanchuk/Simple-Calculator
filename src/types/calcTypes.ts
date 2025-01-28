import React from "react";
export type CalculatorMode = 'basic' | 'engineering';
export interface CalcState {
  mode: CalculatorMode;
  sign: string;
  num: number;
  res: number;
  expression: string;
  brackets: {
    count: number;
    expressions: Array<any>;
  };
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

export interface BracketExpression {
  num: number;
  sign: string;
  res: number;
  expression: string;
}

export interface Operation {
  operator: string;
  value: number;
}
