import React, { useState, useEffect } from "react";
import { Wrapper, ButtonBox, Screen, Button, ModeToggle, History, ThemeToggle, ErrorNotification } from 'components';
import { btnValues, engineeringButtons } from "utils/btnValues";
import { backspaceHandler, closeBracketHandler, commaClickHandler, equalsClickHandler, handleKeyboard, numClickHandler, openBracketHandler, percentClickHandler, resetClickHandler, signClickHandler } from "utils/handlers";
import { ErrorState } from "types/errTypes";
import { useTheme } from "context/ThemeContext";
import { CalcState, SyntheticButtonEvent } from "types/calcTypes";
import { useHistory } from "context/HistoryContext";


const App = () => {
  const [calc, setCalc] = useState<CalcState>({
    mode: 'basic',
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
          <ButtonBox>
            {(calc.mode === 'basic' ? btnValues : engineeringButtons).flat().map((btn, i) => {
              return (
                <Button
                  key={i}
                  className={btn === "=" ? "equals" : ""}
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