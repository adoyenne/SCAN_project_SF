import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Импортируем контекст авторизации
import Header from './components/Header';
import AuthForm from './components/AuthForm';
import HomePage from './components/HomePage';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute'; // Импортируем компонент ProtectedRoute

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="page-container">
          <Header />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<HomePage />} /> {/* Страница главная не защищена */}
              <Route path="/login" element={<AuthForm />} /> {/* Страница авторизации не защищена */}

              {/* Защищенные маршруты */}
              <Route
                path="/search"
                element={<ProtectedRoute element={<SearchForm />} />}
              />
              <Route
                path="/results"
                element={<ProtectedRoute element={<SearchResults />} />}
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;