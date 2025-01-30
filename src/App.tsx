import React, { useState, useEffect } from "react";
import { Wrapper, ButtonBox, Screen, Button, ModeToggle, History, ThemeToggle, ErrorNotification } from 'components';
import { btnValues, engineeringButtons } from "utils/btnValues";
import { backspaceHandler, closeBracketHandler, commaClickHandler, equalsClickHandler, handleKeyboard, numClickHandler, openBracketHandler, percentClickHandler, resetClickHandler, signClickHandler } from "utils/handlers";
import { ErrorState } from "types/errTypes";
import { useTheme } from "context/ThemeContext";
import { CalcState, SyntheticButtonEvent } from "types/calcTypes";
import { useHistory } from "context/HistoryContext";
import { angleUnitHandler, constantHandler, factorialHandler, logarithmHandler, powerHandler, rootHandler, trigonometricHandler } from "utils/engineerHandlers";
import cs from 'classnames';

const App = () => {
  const [calc, setCalc] = useState<CalcState>({
    mode: 'basic',
    equalsClicked: false,
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

  const toggleMode = () => {
    setCalc(prev => ({
      ...prev,
      mode: prev.mode === 'basic' ? 'engineering' : 'basic'
    }));
  };

  const handleButtonClick = (e: SyntheticButtonEvent, btn: string | number) => {
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
        powerHandler(calc.num, calc, setCalc);
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
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => handleKeyboard(e, calc, setCalc, setErr, addToHistory);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [calc, setCalc, setErr, addToHistory])

  return (
    <div className={`app ${theme}`}>
      <ThemeToggle />
      <ModeToggle mode={calc.mode} onToggle={toggleMode} />
      <div className="calculator-container">
        <Wrapper>
          <ErrorNotification message={err.message} show={err.show} onClose={() => setErr({ show: false, message: '', type: null })} />
          <Screen value={calc.num ? calc.num : calc.res} brackets={calc.brackets} expression={calc.expression} />
          <ButtonBox calcMode={calc.mode}>
            {(calc.mode === 'basic' ? btnValues : engineeringButtons).flat().map((btn, i) => {
              return (
                <Button
                  key={i}
                  className={cs({
                    equals: btn === "=" ? "equals" : "",
                    "col4-8": btn === "=" && calc.mode === 'engineering',
                  })}
                  value={btn}
                  onClick={(e) => handleButtonClick(e, btn)}
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