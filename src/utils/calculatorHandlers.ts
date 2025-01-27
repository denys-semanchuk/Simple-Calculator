import { CalcState } from "types/calcTypes";
import { HistoryItem } from "types/historyTypes";

export const toLocaleString = (num: number) =>
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

export const removeSpaces = (num: number | string) =>
  num.toString().replace(/\s/g, "");
const calculateResult = (calc: CalcState) => {
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
    default:
      result = num2;
  }

  return Number(result.toFixed(8));
};

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
