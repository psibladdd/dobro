import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import SecondPage from './secondpage';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:word" element={<SecondPage />} />
      </Routes>
    </Router>
  );
};

export default App;