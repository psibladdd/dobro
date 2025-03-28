import React from 'react';
import { useParams } from 'react-router-dom';
import './SecondPage.css'; // Импортируем CSS файл для стилей

const SecondPage = () => {
  const { word } = useParams();

  let displayWord;
  if (word === 'добро') {
    displayWord = 'Вы уже на половине пути к чему-то интересному! Я знаю, что у нескольких организаторов есть нужная вам информация! Попробуйте написать организатору, у которого брат Юра...';
  } else if (word == '13452') {
    displayWord = 'угпсйу. Я - тот, кто может делать более 5 дел одновременно. Я - велик, но сейчас все знают меня под сладким псевдонимом(';
  }

  return (
    <div className="center-container">
      <p>{displayWord}</p>
      {/* Add more content based on the word if needed */}
    </div>
  );
};

export default SecondPage;
