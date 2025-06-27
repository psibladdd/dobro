import React, { useState } from 'react';
import GameBoard from './GameBoard';
import './App.css';

function App() {
  const [happiness, setHappiness] = useState(0);

  return (
    <div className="App">
      <GameBoard setHappiness={setHappiness} />
    </div>
  );
}

export default App;
