import React, { createContext, useState, useEffect } from 'react';

// Создаем контекст
export const AuthContext = createContext();

// Провайдер для контекста
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  // Проверка токена при загрузке приложения
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setAccessToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Авторизация
  const handleAuthSuccess = (token) => {
    localStorage.setItem('authToken', token);
    setAccessToken(token);
    setIsAuthenticated(true);
  };

  // Выход
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAccessToken(null);
    setIsAuthenticated(false);
  };

    // Метод для проверки авторизации
  const isUserAuthenticated = () => isAuthenticated;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        accessToken,
        handleAuthSuccess,
        handleLogout,
        isUserAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};