import React, { useState, useEffect } from "react";
import { Wrapper, ButtonBox, Screen, Button, ModeToggle, History, ThemeToggle, ErrorNotification } from 'components';
import { btnValues, engineeringButtons } from "utils/btnValues";
import { handleKeyboard } from "utils/handlers";
import { ErrorState } from "types/errTypes";
import { useTheme } from "context/ThemeContext";
import { CalcState } from "types/calcTypes";
import { useHistory } from "context/HistoryContext";
import cs from 'classnames';
import { getLastMode, getLastResult, saveLastMode } from "utils/storageHandlers";
import { handleButtonClick } from "utils/handleButtonClick";

const App = () => {
  const lastSession = getLastResult();
  const [calc, setCalc] = useState<CalcState>({
    mode: getLastMode(),
    equalsClicked: false,
    sign: "",
    num: 0,
    res: lastSession.result,
    expression: lastSession.expression,
    brackets: {
      count: 0,
      expressions: []
    }
  });
  const [err, setErr] = useState<ErrorState>({ show: false, message: '', type: null });
  const { theme } = useTheme();
  const { addToHistory } = useHistory()

  const toggleMode = () => {
    const mode = calc.mode === 'basic' ? 'engineering' : 'basic';
    saveLastMode(mode)
    setCalc(prev => ({
      ...prev,
      mode
    }));
  };

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
                  onClick={(e) => handleButtonClick(calc, setCalc, addToHistory, setErr)(e, btn)}
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