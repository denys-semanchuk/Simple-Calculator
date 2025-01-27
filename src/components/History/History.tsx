import React from 'react';
import { useHistory } from '../../context/HistoryContext';
import { useTheme } from '../../context/ThemeContext';
import './History.css';

const History: React.FC = () => {
  const { history, clearHistory } = useHistory();
  const { theme } = useTheme();

  return (
    <div className={`history ${theme}`}>
      <div className="history-header">
        <h3>Calculation History</h3>
        <button onClick={clearHistory}>Clear</button>
      </div>
      <div className="history-list">
        {history.map((item, index) => (
          <div key={index} className="history-item">
            <div className="expression">{item.expression}</div>
            <div className="result">{item.result}</div>
            <div className="timestamp">
              {new Date(item.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;