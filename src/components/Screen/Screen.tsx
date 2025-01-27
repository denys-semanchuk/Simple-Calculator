import React from "react";
import { Textfit } from "react-textfit";
import "./Screen.css";

const Screen = ({ value }:ScreenProps) => {
  return (
    <Textfit className="screen" mode="single" max={70}>
      {value}
    </Textfit>
  );
};

interface ScreenProps {
  value: string|number;
}

export default Screen;
