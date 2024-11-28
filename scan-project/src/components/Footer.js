import React from "react";
import "../styles/Footer.css";
import eqwImage from "../images/eqw_1.svg";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Картинка логотипа */}
      <div className="footer-logo">
        <img src={eqwImage} alt="Логотип" />
      </div>
      {/* Основной текст */}
      <div className="footer-text">
        <p className="footer-address">г. Москва, Цветной б-р, 40</p>
        <p className="footer-phone">+7 495 771 21 11</p>
        <p className="footer-email">info@skan.ru</p>
        <p className="footer-copyright">Copyright © 2022</p>
      </div>
    </footer>
  );
};

export default Footer;