import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import "../styles/Header.css";
import logo from "../images/SGN_09_24_2022_1663968217400_1.svg"; // Подключите логотип
import avatarPlaceholder from "../images/avatar.svg"; // Аватар по умолчанию
import spinnerImage from "../images/icons8-спиннер,-кадр-5-100_1.svg"; // Спиннер картинка

const Header = () => {
  const { isAuthenticated, accessToken, handleLogout } = useContext(AuthContext); // Доступ к контексту
  const [limits, setLimits] = useState(null); // Данные о лимитах
  const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
  const [error, setError] = useState(null); // Состояние ошибки
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Состояние мобильного меню

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      setIsLoading(true);
      fetch("https://gateway.scan-interfax.ru/api/v1/account/info", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`, // Передача токена
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.eventFiltersInfo) {
            setLimits(data.eventFiltersInfo);
            setError(null); // Сбрасываем ошибку, если данные загружены успешно
          } else {
            throw new Error("Данные о лимитах отсутствуют");
          }
        })
        .catch((error) => {
          console.error("Ошибка при загрузке лимитов:", error.message); // Логирование ошибки
          setError(error.message); // Устанавливаем ошибку
          setLimits(null); // Очищаем данные лимитов
        })
        .finally(() => setIsLoading(false));
    }
  }, [isAuthenticated, accessToken]); // Перезапуск эффекта при изменении состояния

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Логотип" />
      </div>

      <nav className="navigation">
        <a href="/" className="nav-link">Главная</a>
        <a href="/search" className="nav-link">Тарифы</a>
        <a href="/results" className="nav-link">FAQ</a>
      </nav>

      {/* Гамбургер-меню */}
      <div className="hamburger" onClick={toggleMobileMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
        {isAuthenticated ? (
          <>
            <div className="limits-panel">
              {isLoading ? (
                <div className="loader-spin" style={{ backgroundImage: `url(${spinnerImage})` }}></div>
              ) : limits ? (
                <div>
                  <p className="limit-info-title">Использовано компаний:</p>
                  <p className="limit-used-count">{limits.usedCompanyCount || 0}</p>
                  <p className="limit-info-subtitle">Лимит по компаниям:</p>
                  <p className="limit-total-count">{limits.companyLimit || 0}</p>
                </div>
              ) : (
                <p className="error-text">Не удалось загрузить лимиты</p>
              )}
            </div>
            <div className="user-info">
              <span className="user-name">username</span>
              <img src={avatarPlaceholder} alt="Аватар" className="avatar" />
              <button onClick={handleLogout} className="logout-button">Выйти</button>
            </div>
          </>
        ) : (
          <>
            <a href="/register" className="register-link">Зарегистрироваться</a>
            <div className="divider"></div>
            <a href="/login" className="login-button">Войти</a>
          </>
        )}
      </div>

      {/* Панель авторизации для десктопа */}
      <div className="auth-section">
        {isAuthenticated ? (
          <>
            <div className="limit-panel">
              {isLoading ? (
                <div className="loader-spin" style={{ backgroundImage: `url(${spinnerImage})` }}></div>
              ) : limits ? (
                <div>
                  <p className="limit-info-title">Использовано компаний:</p>
                  <p className="limit-used-count">{limits.usedCompanyCount || 0}</p>
                  <p className="limit-info-subtitle">Лимит по компаниям:</p>
                  <p className="limit-total-count">{limits.companyLimit || 0}</p>
                </div>
              ) : (
                <p className="error-text">Не удалось загрузить лимиты</p>
              )}
            </div>
            <div className="user-info">
              <span className="user-name">username</span>
              <img src={avatarPlaceholder} alt="Аватар" className="avatar" />
              <button onClick={handleLogout} className="logout-button">Выйти</button>
            </div>
          </>
        ) : (
          <>
            <a href="/register" className="register-link">Зарегистрироваться</a>
            <div className="divider"></div>
            <a href="/login" className="login-button">Войти</a>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;