import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Feedback from './Feedback';
import Terminal from './Terminal';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/terminal" element={<Terminal />} />
        <Route path="/" element={<Feedback />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
