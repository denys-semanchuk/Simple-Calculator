import React, { ReactNode } from "react";
import "./ButtonBox.css";
import { CalculatorMode } from "types/calcTypes";

const ButtonBox: React.FC<ButtonBoxProps> = ({ children, calcMode }: ButtonBoxProps) => {
  return <div className={`buttonBox ${calcMode ==='engineering' && 'fr5'}`}>{children}</div>;
};

interface ButtonBoxProps {
  children: ReactNode,
  calcMode: CalculatorMode
}
export default ButtonBox;
