// src/components/HomePage.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Импортируем AuthContext
import Header from './Header';
import WelcomeSection from './WelcomeSection';
import WhyUsSection from './WhyUsSection';
import '../styles/WhyUsSection.css';
import image_group_14 from "../images/Group_14.svg";
import TariffsSection from './TariffsSection';

const HomePage = () => {
  const { isAuthenticated } = useContext(AuthContext); // Получаем состояние авторизации из контекста
  const [selectedTariff, setSelectedTariff] = useState(null); // Состояние для выбранного тарифа
  const navigate = useNavigate();

  // Функция для обновления выбранного тарифа
  const handleSelectTariff = (tariff) => {
    setSelectedTariff(tariff);
  };



  // Функция для обработки перехода при клике на кнопку "Запросить данные"
  const handleShowSearchForm = () => {
    if (isAuthenticated) {
      navigate('/search'); // Переход на страницу поиска
    } else {
      alert("Авторизуйтесь, чтобы запросить данные!");
    }
  };




  return (
    <div className="home-page-wrapper">
      <main className="home-page-container">
        <div>
            <WelcomeSection
              onRequestData={handleShowSearchForm} // Передаем функцию для показа формы
            />
        </div>
        <WhyUsSection />
        {/* Новый блок с картинкой */}
        <div className="group-14-image">
          <img src={image_group_14} alt="Group 14" className="group-14-image" />
        </div>
        <TariffsSection
        isAuthenticated={isAuthenticated}
        selectedTariff={selectedTariff}
        onSelectTariff={handleSelectTariff}
      />
      </main>
    </div>
  );
};

export default HomePage;


