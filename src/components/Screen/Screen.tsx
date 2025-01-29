import React from "react";
import "./Screen.css";

const Screen = ({ value,expression, brackets }: ScreenProps) => {
  return (
    <div className="screen">
      <div className="brackets-count">
        {brackets!.count > 0 && `(x${brackets!.count})`}
      </div>
      <div className="expression">{expression || '0'}</div>
      <div className="screen-value screen">
        {value}
      </div>
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
