import React from "react";
import "./ButtonBox.css";
import { WrapperProps } from './../../types/index';

const ButtonBox: React.FC<WrapperProps> = ({ children }) => {
  return <div className="buttonBox">{children}</div>;
};

export default ButtonBox;
