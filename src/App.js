import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 2, y: 2 });
  const [color, setColor] = useState('#ff0000');
  const textRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    const animate = () => {
      const textRect = textRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      let newX = position.x + velocity.x;
      let newY = position.y + velocity.y;
      let newVx = velocity.x;
      let newVy = velocity.y;

      if (newX + textRect.width > containerRect.width) {
        newX = containerRect.width - textRect.width;
        newVx = -velocity.x;
        setColor(getRandomColor());
      }
      else if (newX < 0) {
        newX = 0;
        newVx = -velocity.x;
        setColor(getRandomColor());
      }

      if (newY + textRect.height > containerRect.height) {
        newY = containerRect.height - textRect.height;
        newVy = -velocity.y;
        setColor(getRandomColor());
      }
      else if (newY < 0) {
        newY = 0;
        newVy = -velocity.y;
        setColor(getRandomColor());
      }

      setPosition({ x: newX, y: newY });
      setVelocity({ x: newVx, y: newVy });
    };

    const animationId = requestAnimationFrame(function frame() {
      animate();
    });

    return () => cancelAnimationFrame(animationId);
  }, [position, velocity]);

  // Функция для генерации случайного цвета
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="container" ref={containerRef}>
      <div
        ref={textRef}
        className="bouncing-text"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          color: color
        }}
      >
        ВМВМ
      </div>
    </div>
  );
}

export default App;