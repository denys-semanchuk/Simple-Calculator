import React, { useState, useEffect } from "react";
import { Wrapper } from 'components/Wrapper/Wrapper';
import ButtonBox from 'components/ButtonBox/ButtonBox';
import Button from "components/Button/Button";
import Screen from 'components/Screen/Screen';
import { btnValues } from "utils/btnValues";
import { backspaceHandler, closeBracketHandler, commaClickHandler, equalsClickHandler, handleKeyboard, numClickHandler, openBracketHandler, percentClickHandler, resetClickHandler, signClickHandler } from "utils/handlers";
import { ErrorState } from "types/errTypes";
import ErrorNotification from "components/ErrorNotification/ErrorNotification";
import { useTheme } from "context/ThemeContext";
import ThemeToggle from "components/ThemeToggle/ThemeToggle";
import { CalcState } from "types/calcTypes";
import History from "components/History/History";
import { useHistory } from "context/HistoryContext";


const App = () => {
  const [calc, setCalc] = useState<CalcState>({
    sign: "",
    num: 0,
    res: 0,
    expression: '',
    brackets: {
      count: 0,
      expressions: []
    }
  });
  const [err, setErr] = useState<ErrorState>({ show: false, message: '', type: null });
  const { theme } = useTheme();
  const { addToHistory } = useHistory()
  useEffect(() => {
    window.addEventListener('keydown', (e) => handleKeyboard(e, calc, setCalc, setErr, addToHistory));
    return () => {
      window.removeEventListener('keydown', (e) => handleKeyboard(e, calc, setCalc, setErr, addToHistory));
    };
  }, []);

  return (
    <div className={`app ${theme}`}>
      <ThemeToggle />
      <div className="calculator-container">
        <Wrapper>
          <ErrorNotification message={err.message} show={err.show} onClose={() => setErr({ show: false, message: '', type: null })} />
          <Screen value={calc.num ? calc.num : calc.res} brackets={calc.brackets} expression={calc.expression}/>
          <ButtonBox>
            {btnValues.flat().map((btn, i) => {
              return (
                <Button
                  key={i}
                  className={btn === "=" ? "equals" : ""}
                  value={btn}
                  onClick={(e) => {
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
                      default:
                        numClickHandler(e, calc, setCalc, setErr);
                        break;
                    }
                  }}
                />
              );
            })}
          </ButtonBox>
        </Wrapper>
        <History />
      </div>
    </div>
  );
};

export default App;