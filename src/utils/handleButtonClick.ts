import { CalcState, SyntheticButtonEvent } from "types/calcTypes";
import {
  backspaceHandler,
  closeBracketHandler,
  commaClickHandler,
  equalsClickHandler,
  numClickHandler,
  openBracketHandler,
  percentClickHandler,
  resetClickHandler,
  signClickHandler,
} from "./handlers";
import {
  angleUnitHandler,
  constantHandler,
  factorialHandler,
  logarithmHandler,
  powerHandler,
  rootHandler,
  trigonometricHandler,
} from "./engineerHandlers";
import { HistoryItem } from "types/historyTypes";
import { ErrorState } from "types/errTypes";

export const handleButtonClick = (
  calc: CalcState,
  setCalc: React.Dispatch<React.SetStateAction<CalcState>>,
  addToHistory: (item: HistoryItem) => void,
  setErr: React.Dispatch<React.SetStateAction<ErrorState>>
) => {
  return (e: SyntheticButtonEvent, btn: string | number) => {
    switch (btn) {
      case "(":
        openBracketHandler(calc, setCalc);
        break;
      case ")":
        closeBracketHandler(calc, setCalc);
        break;
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
        signClickHandler(e, calc, setCalc);
        break;
      case ".":
        commaClickHandler(e, calc, setCalc);
        break;

      case "sin":
      case "cos":
      case "tan":
        trigonometricHandler(btn, calc, setCalc);
        break;

      case "log":
      case "ln":
        logarithmHandler(btn, calc, setCalc);
        break;

      case "x²":
        powerHandler(2, calc, setCalc);
        break;

      case "√":
        rootHandler(calc, setCalc);
        break;

      case "^":
        powerHandler(Number(calc.num), calc, setCalc);
        break;

      case "π":
        constantHandler(Math.PI, calc, setCalc);
        break;

      case "e":
        constantHandler(Math.E, calc, setCalc);
        break;

      case "!":
        factorialHandler(calc, setCalc);
        break;

      case "rad":
      case "deg":
        angleUnitHandler(btn, calc, setCalc);
        break;
      default:
        numClickHandler(e, calc, setCalc, setErr);
        break;
    }
  };
};
