import React from 'react';
import { useTheme } from 'context/ThemeContext';
import { CalculatorMode } from 'types/calcTypes';
import './ModeToggle.css';

interface ModeToggleProps {
  mode: CalculatorMode;
  onToggle: () => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onToggle }) => {
  const { theme } = useTheme();
  
  return (
    <button 
      className={`mode-toggle ${theme} ${mode}`} 
      onClick={onToggle}
    >
      {mode === 'basic' ? 'Basic' : 'Engineering'}
    </button>
  );
};

export default ModeToggle;