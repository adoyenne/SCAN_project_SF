import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Импортируем AuthContext
import heroImage from '../images/Group_13.svg';
import '../styles/HomePage.css';

const WelcomeSection = ({ onRequestData }) => {
  const { isAuthenticated } = useContext(AuthContext); // Получаем состояние авторизации из контекста

  return (
    <section className="welcome-section">
      <div className="welcome-text">
        <h1>Сервис по поиску</h1>
        <h1>публикаций</h1>
        <h1>о компании</h1>
        <h1>по его ИНН</h1>
        <p>Комплексный анализ публикаций, получение данных</p>
        <p>в формате PDF на электронную почту.</p>
        {isAuthenticated ? (
          <button
            className="request-button"
            onClick={onRequestData} // Обработчик показа формы
          >
            Запросить данные
          </button>
        ) : (
          <p className="auth-warning">Авторизуйтесь, чтобы запросить данные</p>
        )}
      </div>
      <div className="welcome-image">
        <img src={heroImage} alt="Hero" />
      </div>
    </section>
  );
};

export default WelcomeSection;