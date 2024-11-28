import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Импортируем AuthContext
import "../styles/Tariffs.css";
import beginnerIcon from "../images/Group_1171274215.svg";
import proIcon from "../images/Group_1171274216.svg";
import businessIcon from "../images/Group_1171274214.svg";
import checkIcon from "../images/icons8-галочка-96_1.svg";


const Tariffs = ({selectedTariff, onSelectTariff }) => {
  const { isAuthenticated } = useContext(AuthContext); // Получаем состояние авторизации из контекста
  const navigate = useNavigate();

  const handleButtonClick = (tariff) => {
    if (isAuthenticated) {
      if (selectedTariff === tariff) {
        navigate("/personal-cabinet"); // Переход в личный кабинет
      }
    } else {
      navigate("/login"); // Переход на страницу входа
    }
  };

  const renderButton = (tariff) => {
    if (isAuthenticated && selectedTariff === tariff) {
      return (
        <button className="tariff-button-gray" onClick={() => handleButtonClick(tariff)}>
          Перейти в личный кабинет
        </button>
      );
    } else {
      return (
        <button className="tariff-button-blue" onClick={() => handleButtonClick(tariff)}>
          Подробнее
        </button>
      );
    }
  };

  const renderCurrentTariffBadge = (tariff) => {
    if (isAuthenticated && selectedTariff === tariff) {
      return <div className="tariff-label">Текущий тариф</div>;
    }
    return null;
  };

  return (
    <div className="tariffs-page">
      <h1 className="tariffs-title">Наши тарифы</h1>
      <div className="tariffs-container">
        {/* Beginner */}
        <div
          className={`tariff-box ${selectedTariff === "Beginner" ? "selected beginner" : ""}`}
          onClick={() => onSelectTariff("Beginner")}
        >
          <div className="tariff-header">
            <div>
              <p className="tariff-title">Beginner</p>
              <p className="tariff-subtitle">Для небольшого исследования</p>
            </div>
            <img src={beginnerIcon} alt="Beginner Icon" className="tariff-icon" />
          </div>
          {renderCurrentTariffBadge("Beginner")}
          <div className="tariff-price">
            <span className="current-price">799 ₽</span>
            <span className="old-price">1 200 ₽</span>
            <p className="installment">или 150 ₽/мес. при рассрочке на 24 мес.</p>
          </div>
          <div className="tariff-features">
            <p className="features-title">В тариф входит:</p>
            <ul className="features-list">
              <li><img src={checkIcon} alt="check" /> Безлимитная история запросов</li>
              <li><img src={checkIcon} alt="check" /> Безопасная сделка</li>
              <li><img src={checkIcon} alt="check" /> Поддержка 24/7</li>
            </ul>
          </div>
          {renderButton("Beginner")}
        </div>

        {/* Pro */}
        <div
          className={`tariff-box ${selectedTariff === "Pro" ? "selected pro" : ""}`}
          onClick={() => onSelectTariff("Pro")}
        >
          <div className="pro-header">
            <div>
              <h3 className="tariff-title">Pro</h3>
              <p className="tariff-subtitle">Для HR и фрилансеров</p>
            </div>
            <img src={proIcon} alt="Pro Icon" className="tariff-icon" />
          </div>
          {renderCurrentTariffBadge("Pro")}
          <div className="tariff-price">
            <span className="current-price">1 299 ₽</span>
            <span className="old-price">2 600 ₽</span>
            <p className="installment">или 279 ₽/мес. при рассрочке на 24 мес.</p>
          </div>
          <div className="tariff-features">
            <p className="features-title">В тариф входит:</p>
            <ul className="features-list">
              <li><img src={checkIcon} alt="check" /> Все пункты тарифа Beginner</li>
              <li><img src={checkIcon} alt="check" /> Экспорт истории</li>
              <li><img src={checkIcon} alt="check" /> Рекомендации по приоритетам</li>
            </ul>
          </div>
          {renderButton("Pro")}
        </div>

        {/* Business */}
        <div
          className={`tariff-box ${selectedTariff === "Business" ? "selected business" : ""}`}
          onClick={() => onSelectTariff("Business")}
        >
          <div className="business-header">
            <div>
              <h3 className="tariff-title-business">Business</h3>
              <p className="tariff-subtitle-business">Для корпоративных клиентов</p>
            </div>
            <img src={businessIcon} alt="Business Icon" className="tariff-icon" />
          </div>
          {renderCurrentTariffBadge("Business")}
          <div className="tariff-price">
            <span className="current-price">2 379 ₽</span>
            <span className="old-price">3 700 ₽</span>
          </div>
          <div className="tariff-features">
            <p className="features-title">В тариф входит:</p>
            <ul className="features-list">
              <li><img src={checkIcon} alt="check" /> Все пункты тарифа Pro</li>
              <li><img src={checkIcon} alt="check" /> Безлимитное количество запросов</li>
              <li><img src={checkIcon} alt="check" /> Приоритетная поддержка</li>
            </ul>
          </div>
          {renderButton("Business")}
        </div>
      </div>
    </div>
  );
};

export default Tariffs;