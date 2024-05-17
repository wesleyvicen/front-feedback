import React, { useState } from 'react';
import io from 'socket.io-client';
import './Terminal.css';

const socket = io('http://localhost:8080');

function Terminal() {
  const [employee, setEmployee] = useState('');

  const employees = [
    'Funcionário 1',
    'Funcionário 2',
    'Funcionário 3',
    'Funcionário 4',
  ];

  const startVoting = () => {
    if (employee) {
      socket.emit('start', { employee });
    } else {
      alert('Por favor, selecione um funcionário.');
    }
  };

  return (
    <div className="terminal-container">
      <h1 className="terminal-header">Iniciar Votação</h1>
      <div className="terminal-content">
        <label htmlFor="employee-select" className="terminal-label">Selecione o Funcionário:</label>
        <select
          id="employee-select"
          className="terminal-select"
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
        >
          <option value="">Selecione um funcionário</option>
          {employees.map((emp, index) => (
            <option key={index} value={emp}>{emp}</option>
          ))}
        </select>
        <button className="terminal-button" onClick={startVoting}>Iniciar Votação</button>
      </div>
    </div>
  );
}

export default Terminal;
