import React from 'react';
import { useParams } from 'react-router-dom';
import './SecondPage.css'; // Импортируем CSS файл для стилей

const SecondPage = () => {
  const { word } = useParams();

  let displayWord;
  if (word === 'призрак') {
    displayWord = 'Предъявите 4 уровень';
  }
  else if (word === 'молчание') {
    displayWord = 'Вы должны сделать выбор. Кому доверитесь?';
  }else if (word === '0043') {
    displayWord = 'начало поможет вам закончить это дело';
  }else if (word === '328331') {
    displayWord = '"ПРОТОКОЛ \'ЗАКАТ\' АКТИВИРОВАН. ЛАБОРАТОРИЯ ЗАПЕЧАТАНА."';
  }

  return (
    <div className="center-container">
      <p style={{color:"white"}}>{displayWord}</p>
      {/* Add more content based on the word if needed */}
    </div>
  );
};

export default SecondPage;
