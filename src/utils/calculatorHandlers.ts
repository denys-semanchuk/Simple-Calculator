import { CalcState } from "types/calcTypes";
import { HistoryItem } from "types/historyTypes";
import { calculateResult } from "./handlers";

export const toLocaleString = (num: number) =>
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

export const removeSpaces = (num: number | string) =>
  num.toString().replace(/\s/g, "");

export const equalsClickHandler = (
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>,
  addToHistory: (item: HistoryItem) => void
) => {
  if (calc.sign && calc.num) {
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
