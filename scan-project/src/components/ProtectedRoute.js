import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Импортируем контекст авторизации

// Компонент для защиты маршрутов
const ProtectedRoute = ({ element }) => {
  const { isUserAuthenticated } = useContext(AuthContext); // Получаем метод из контекста для проверки авторизации

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isUserAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return element; // Если авторизован, возвращаем переданный элемент
};

export default ProtectedRoute;