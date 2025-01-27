import React from "react";
import { Textfit } from "react-textfit";
import "./Screen.css";

const Screen = ({ value,expression, brackets }: ScreenProps) => {
  return (
    <div className="screen">
      <div className="brackets-count">
        {brackets!.count > 0 && `(x${brackets!.count})`}
      </div>
      <div className="expression">{expression || '0'}</div>
      <Textfit className="screen" mode="single" max={70}>
        {value}
      </Textfit>
    </div>
  );
};

interface ScreenProps {
  value: number;
  brackets?: {
    count: number;
    expressions: Array<any>;
  };
  expression:string;
}

export default Screen;
