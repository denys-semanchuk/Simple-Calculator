import { CalculatorMode } from "types/calcTypes";

const saveLastResult = (result: number, expression: string, mode?: string) => {
  localStorage.setItem("lastResult", result.toString());
  localStorage.setItem("lastExpression", expression);
  localStorage.setItem("lastMode", mode || "basic");
};

const getLastResult = () => ({
  result: parseFloat(localStorage.getItem("lastResult") || "0"),
  expression: localStorage.getItem("lastExpression") || "",
  mode: localStorage.getItem("lastMode") || "basic",
});

const saveLastMode = (mode: CalculatorMode): void => {
  localStorage.setItem("calculatorMode", mode);
};

const getLastMode = (): CalculatorMode => {
  return (localStorage.getItem("calculatorMode") as CalculatorMode) || "basic";
};

export { saveLastResult, getLastResult, saveLastMode, getLastMode };
