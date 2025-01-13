import React from "react";
import "./Button.css";
export interface ButtonProps {
  key?: number;
  className: string;
  value: string | number;
  onClick: (e: any) => void;
}

const Button = ({ className, value, onClick, key}: ButtonProps) => {
  return (
    <button className={className} onClick={onClick}>
      {value}
    </button>
  );
};

export default Button;