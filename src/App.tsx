import React, { useState, useEffect } from "react";
import { Wrapper } from './components/Wrapper/Wrapper.tsx';
import ButtonBox from './components/ButtonBox/ButtonBox.tsx';
import Button from "./components/Button/Button.tsx";
import Screen from './components/Screen/Screen.tsx';
import { btnValues } from "./utils/btnValues.ts";
import { backspaceHandler, commaClickHandler, equalsClickHandler, handleKeyboard, numClickHandler, percentClickHandler, resetClickHandler, signClickHandler } from "./utils/handlers.ts";



const App = () => {
  const [calc, setCalc] = useState({
    sign: "",
    num: 0,
    res: 0,
  });


  useEffect(() => {
    window.addEventListener('keydown', (e) => handleKeyboard(e, calc, setCalc));
    return () => {
      window.removeEventListener('keydown', (e) => handleKeyboard(e, calc, setCalc));
    };
  }, [calc]);

  return (
    <Wrapper>
      <Screen value={calc.num ? calc.num : calc.res} />
      <ButtonBox>
        {btnValues.flat().map((btn, i) => {
          return (
            <Button
              key={i}
              className={btn === "=" ? "equals" : ""}
              value={btn}
              onClick={(e) => {
                switch (btn) {
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
                    equalsClickHandler(calc, setCalc);
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
                    numClickHandler(e, calc, setCalc);
                    break;
                }
              }}
            />
          );
        })}
      </ButtonBox>
    </Wrapper>
  );
};

export default App;