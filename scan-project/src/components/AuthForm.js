import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Импорт useNavigate
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Импортируем AuthContext
import '../styles/AuthForm.css'; // Подключаем стили
import googleIcon from '../images/Google_icon.svg';
import facebookIcon from '../images/Facebook_icon.svg';
import yandexIcon from '../images/Yandex_icon.svg';
import characterImg from '../images/Characters.svg';
import lockIcon from '../images/Group_1171274237.svg';

const AuthForm = () => {
  const { handleAuthSuccess } = useContext(AuthContext); // Получаем метод из контекста
  const [username, setUsername] = useState(''); // Состояние для передачи между компонентами
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Переключение вкладок
  const [error, setError] = useState(false); // Флаг ошибки
  const navigate = useNavigate(); // Хук для навигации


const handleSubmit = async (e) => {
  e.preventDefault();
  setError(false); // Сбрасываем ошибку перед запросом

  if (username && password) {
    try {
      // Отправляем POST-запрос на API для авторизации
      const response = await axios.post(
        'https://gateway.scan-interfax.ru/api/v1/account/login',
        { login: username, password },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      // Получаем токен
      const { accessToken } = response.data;

      // Вызываем метод контекста для успешной авторизации
      handleAuthSuccess(accessToken);

      // Перенаправляем на главную страницу
      navigate('/');
    } catch (err) {
      console.error('Ошибка авторизации', err);
      setError(true); // Устанавливаем ошибку, если логин/пароль неверны
    }
  }
};

  return (
    <div className="auth-page">
      {/* Левый блок */}
      <div className="text-wrapper">
        <h3>Для оформления подписки на тариф, необходимо авторизоваться.</h3>
        <div className="image-wrapper">
          <img src={characterImg} alt="Character illustration" />
        </div>
      </div>

      {/* Правый блок (форма) */}
      <div className="form-wrapper">
        <div className="lock-icon">
          <img src={lockIcon} alt="Lock icon" />
        </div>

        {/* Вкладки */}
        <div className="tabs">
          <div
            className={`tab ${isLogin ? 'selected' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Войти
          </div>
          <div
            className={`tab ${!isLogin ? 'selected' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Зарегистрироваться
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={`input-wrapper ${error ? 'error' : ''}`}>
            <label className="input-label">Логин или номер телефона:</label>
            <input
              type="text"
              className={`input-field ${error ? 'input-error' : ''}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите логин"
              required
            />
          </div>
          <div className={`input-wrapper ${error ? 'error' : ''}`}>
            <label className="input-label">Пароль:</label>
            <input
              type="password"
              className={`input-field ${error ? 'input-error' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
            />
          </div>
          {error && <p className="error-message">Неверный логин или пароль</p>} {/* Ошибка */}
          <button
            type="submit"
            className="button"
            disabled={!username || !password}
          >
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        {/* Ссылка на восстановление пароля */}
        {isLogin && (
          <a href="/reset-password" className="reset-password">
            Восстановить пароль
          </a>
        )}

        {/* Соцсети */}
        <p className="social-login-title">Войти через:</p>
        <div className="social-login-buttons">
          <button className="social-button">
            <img src={googleIcon} alt="Google" />
          </button>
          <button className="social-button">
            <img src={facebookIcon} alt="Facebook" />
          </button>
          <button className="social-button">
            <img src={yandexIcon} alt="Yandex" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;