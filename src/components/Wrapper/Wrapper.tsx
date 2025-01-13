import React from "react";
import "./Wrapper.css";
import { WrapperProps } from "../../types";


export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return <div className="wrapper">{children}</div>;
};
