import React, { useState } from "react";
import "../styles/WhyUsSection.css";

// Импорт изображений
import timeIcon from "../images/icons8-время-64_1.svg";
import searchIcon from "../images/icons8-расширенный-поиск-100_1.svg";
import lockIcon from "../images/icons8-накладка-дверного-замка-64_1.svg";
import arrowIcon from "../images/icons8-шеврон-вправо-90_1.svg";

const WhyUsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const carouselItems = [
    {
      id: 1,
      text: "Высокая и оперативная скорость обработки заявки",
      icon: timeIcon,
    },
    {
      id: 2,
      text: "Огромная комплексная база данных, обеспечивающая объективный ответ на запрос",
      icon: searchIcon,
    },
    {
      id: 3,
      text: "Защита конфиденциальных сведений, не подлежащих разглашению по законодательству",
      icon: lockIcon,
    },
    {
      id: 4,
      text: "Опытные специалисты с высокой квалификацией",
      icon: timeIcon,
    },
    {
      id: 5,
      text: "Использование современных технологий для решения задач",
      icon: timeIcon,
    },
  ];

  // Логика сдвига влево
  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  // Логика сдвига вправо
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % carouselItems.length);
  };

  // Рассчитываем стили для каждой карточки
  const gap = 20; // Расстояние между карточками

const getCardStyles = (index) => {
  const totalItems = carouselItems.length;
  const relativeIndex = (index - activeIndex + totalItems) % totalItems;

  if (relativeIndex === 0) return { transform: `translateX(calc(-100% - ${gap}px))`, zIndex: 2 };
  if (relativeIndex === 1) return { transform: "translateX(0)", zIndex: 3 }; // Центральная карточка
  if (relativeIndex === 2) return { transform: `translateX(calc(100% + ${gap}px))`, zIndex: 2 };

  return { transform: `translateX(calc(200% + ${gap * 2}px))`, opacity: 0 }; // Скрытые карточки
};

  return (
    <section className="why-us-section">
      <h2 className="why-us-title">Почему именно мы</h2>
      <div className="carousel-container">
        <button
          className="carousel-arrow right-arrow"
          onClick={handlePrev}
          style={{ backgroundImage: `url(${arrowIcon})` }}
        ></button>

        <div className="carousel-track">
          {carouselItems.map((item, index) => (
            <div
              key={item.id}
              className="carousel-item"
              style={getCardStyles(index)} // Применяем стили для каждой карточки
            >
              <div className="carousel-icon-wrapper">
                <img src={item.icon} alt="" className="carousel-icon" />
              </div>
              <p className="carousel-text">{item.text}</p>
            </div>
          ))}
        </div>

        <button
          className="carousel-arrow left-arrow"
          onClick={handleNext}
          style={{ backgroundImage: `url(${arrowIcon})` }}
        ></button>
      </div>
    </section>
  );
};

export default WhyUsSection;