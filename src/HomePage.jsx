import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./App.css"

const HomePage = () => {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = () => {
    if (inputValue === 'добро' || inputValue === '356876239671056') {
      navigate(`/${inputValue}`);
    } else {
      alert('Анлука неправильно(');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder=""
      />
      <button onClick={handleButtonClick}>проверить</button>
    </div>
  );
};

export default HomePage;
