import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./App.css";

const HomePage = () => {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = () => {
    if (inputValue === 'призрак' || inputValue === 'молчание' || inputValue === '0043' || inputValue === '328331') {
      navigate(`/${inputValue}`);
    }
  };

  return (
    <div style={{
      backgroundColor: 'black',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder=""
        style={{
          padding: '10px',
          backgroundColor: '#6a0dad', // Фиолетовый цвет
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          marginBottom: '10px',
          outline: 'none',
        }}
      />
      <button
        onClick={handleButtonClick}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4b0082', // Темно-фиолетовый
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        проверить
      </button>
    </div>
  );
};

export default HomePage;
