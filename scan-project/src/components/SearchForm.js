import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Импортируем AuthContext
import "../styles/SearchForm.css";
import Document from "../images/Document.svg";
import Folders from "../images/Folders.svg";
import Group_1171274244 from "../images/Group_1171274244.svg";
import checkIcon from "../images/icons8-галочка-96_1.svg";

const SearchForm = () => {
  const { accessToken } = useContext(AuthContext); // Получаем accessToken из контекста

  const [formData, setFormData] = useState({
    inn: "",
    tone: "Любая",
    documentCount: "",
    startDate: "",
    endDate: "",
    fullness: false,
    businessContext: false,
    mainRole: false,
    includeAnnouncements: false,
    includeTechNews: false,
    includeSummaries: false,
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    inn: null,
    documentCount: null,
    startDate: null,
    endDate: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    return (
      formData.inn &&
      formData.documentCount &&
      formData.startDate &&
      formData.endDate &&
      !Object.values(errors).some((error) => error)
    );
  };

  const validateInn = (inn) => {
    let error = null;
    let isValid = false;

    if (typeof inn === "number") inn = inn.toString();
    if (!inn) {
      error = "ИНН не может быть пустым";
    } else if (/[^0-9]/.test(inn)) {
      error = "ИНН может содержать только цифры";
    } else if (![10, 12].includes(inn.length)) {
      error = "ИНН должен содержать 10 или 12 цифр";
    } else {
      const checkDigit = (inn, coefficients) => {
        let n = 0;
        coefficients.forEach((coef, index) => {
          n += coef * inn[index];
        });
        return parseInt(n % 11 % 10, 10);
      };

      if (inn.length === 10) {
        const n10 = checkDigit(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8]);
        isValid = n10 === parseInt(inn[9], 10);
      } else if (inn.length === 12) {
        const n11 = checkDigit(inn, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
        const n12 = checkDigit(inn, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
        isValid = n11 === parseInt(inn[10], 10) && n12 === parseInt(inn[11], 10);
      }

      if (!isValid) error = "Неправильное контрольное число";
    }
    return { isValid, error };
  };

  const validateDocumentCount = (count) => {
    let error = null;
    let isValid = false;

    if (!count) {
      error = "Поле не может быть пустым";
    } else if (isNaN(count)) {
      error = "Значение должно быть числом";
    } else if (count <= 0 || count > 1000) {
      error = "Введите число от 1 до 1000";
    } else {
      isValid = true;
    }

    return { isValid, error };
  };

  const validateDateRange = (startDate, endDate) => {
  let error = null;
  let isValid = false;

  const currentDate = new Date();

  // Преобразуем строки в объекты Date
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  // Проверка на наличие обеих дат
  if (!start || !end) {
    if (!start && !end) {
      error = "Обе даты должны быть указаны";
    } else if (!start) {
      error = "Дата начала должна быть указана";
    } else if (!end) {
      error = "Дата окончания должна быть указана";
    }
  }
  // Проверка диапазона дат
  else if (start > end) {
    error = "Дата начала не может быть позже даты окончания";
  }
  // Проверка на будущее время
  else if (start > currentDate || end > currentDate) {
    error = "Дата не может быть в будущем";
  }
  // Если все проверки пройдены
  else {
    isValid = true;
  }

  return { isValid, error };
  };

  const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;

  // Обновляем форму
  const updatedFormData = {
    ...formData,
    [name]: type === "checkbox" ? checked : value,
  };

  setFormData(updatedFormData);

  // Переменная для валидации
  let validation;

  // Валидация каждого поля
  if (name === "inn") {
    validation = validateInn(value);
  } else if (name === "documentCount") {
    validation = validateDocumentCount(value);
  }

  // Валидация диапазона дат, если одно из полей startDate или endDate изменено
  if (name === "startDate" || name === "endDate") {
    validation = validateDateRange(updatedFormData.startDate, updatedFormData.endDate);

    // Обновляем сразу обе ошибки, связанные с диапазоном дат
    setErrors((prev) => ({
      ...prev,
      startDate: !validation.isValid ? validation.error : null,
      endDate: !validation.isValid ? validation.error : null,
    }));
    return; // Выходим, чтобы не обновлять ошибку только для startDate или endDate отдельно
  }

  // Обновляем ошибки для других полей
  if (validation) {
    setErrors((prev) => ({
      ...prev,
      [name]: !validation.isValid ? validation.error : null,
    }));
  }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверяем наличие токена
    if (!accessToken) {
      console.error('Токен отсутствует. Авторизация требуется.');
      return;
    }

    const innValidation = validateInn(formData.inn);
    const documentCountValidation = validateDocumentCount(formData.documentCount);
    const dateRangeValidation = validateDateRange(formData.startDate, formData.endDate);

    const newErrors = {
      inn: !innValidation.isValid ? innValidation.error : null,
      documentCount: !documentCountValidation.isValid ? documentCountValidation.error : null,
      startDate: !dateRangeValidation.isValid ? dateRangeValidation.error : null,
      endDate: !dateRangeValidation.isValid ? dateRangeValidation.error : null,
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).some((error) => error)) {

        const requestData = {
  issueDateInterval: {
    startDate: `${formData.startDate}T00:00:00+03:00`, // Формат с временной зоной
    endDate: `${formData.endDate}T23:59:59+03:00`,     // Формат с временной зоной
  },
  searchContext: {
    targetSearchEntitiesContext: {
      targetSearchEntities: [
        {
          type: "company", // Обязательно "company"
          sparkId: null,   // null для поиска по ИНН
          entityId: null,  // null для поиска по ИНН
          inn: formData.inn, // ИНН компании, строка
          maxFullness: !!formData.fullness, // Преобразуем в булевое значение
          inBusinessNews: null, // null, если не задано
        },
      ],
      onlyMainRole: !!formData.mainRole, // Булевое значение
      tonality: formData.tone === "Любая" ? "any" : formData.tone.toLowerCase(), // any, positive, negative
      onlyWithRiskFactors: !!formData.riskFactors, // Булевое значение
    },
    riskFactors: {
      and: [], // Логические фильтры для риск-факторов
      or: [],
      not: [],
    },
    themes: {
      and: [], // Логические фильтры для тем
      or: [],
      not: [],
    },
  },
  themesFilter: {
    and: [], // Логические фильтры тем
    or: [],
    not: [],
  },
  searchArea: {
    includedSources: [], // Включенные источники
    excludedSources: [], // Исключенные источники
    includedSourceGroups: [], // Включенные группы источников
    excludedSourceGroups: [], // Исключенные группы источников
  },
  attributeFilters: {
    excludeTechNews: !!formData.includeMarketNews, // Исключение технических новостей
    excludeAnnouncements: !!formData.includeAnnouncements, // Исключение объявлений
    excludeDigests: !!formData.includeNewsSummaries, // Исключение дайджестов
  },
  similarMode: "duplicates", // Режим дубликатов: "none" или "duplicates"
  limit: Number(formData.documentCount), // Преобразуем в число
  sortType: "sourceInfluence", // Тип сортировки (например, по влиянию источника)
  sortDirectionType: "desc", // Направление сортировки: по убыванию
  intervalType: "month", // Интервалы статистики: месяц
  histogramTypes: ["totalDocuments", "riskFactors"], // Типы статистики
};

      setIsLoading(true);

      console.log('Данные в requestData:', JSON.stringify(requestData));

    navigate("/results", { state: { requestData, isLoading: true } });


    }
  };

  return (
    <div className="search-page">
      <div className="header-container">
        <h1 className="main-header">Найдите необходимые данные в пару кликов.</h1>
        <p className="sub-header">
          Задайте параметры поиска. Чем больше заполните, тем точнее поиск.
        </p>
        <img className="header-image document" src={Document} alt="Документ" />
        <img className="header-image folders" src={Folders} alt="Папки" />
        <img className="header-image group-image" src={Group_1171274244} alt="Группа изображений" />
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-left">
          <div className="form-group-row">
            <label htmlFor="inn">ИНН компании *</label>
            <input
              type="text"
              id="inn"
              name="inn"
              placeholder="10 или 12 цифр"
              value={formData.inn}
              onChange={handleInputChange}
              className={`input-field ${errors.inn ? "error" : ""}`}
            />
            {/* Сообщение об ошибке */}
      <div className={`error-message ${errors.inn ? "active" : ""}`}>
        {errors.inn}
      </div>
          </div>

          <div className="form-group-row">
            <label htmlFor="tone">Тональность</label>
            <select
              id="tone"
              name="tone"
              value={formData.tone}
              onChange={handleInputChange}
              className={`input-field ${errors.tone ? "error" : ""}`}
            >
              <option value="Любая">Любая</option>
              <option value="Позитивная">Позитивная</option>
              <option value="Негативная">Негативная</option>
            </select>
          </div>

          <div className="form-group-row">
            <label htmlFor="document-count">Количество документов *</label>
            <input
              type="number"
              id="document-count"
              name="documentCount"
              placeholder="От 1 до 1000"
              value={formData.documentCount}
              onChange={handleInputChange}
              className={`input-field ${errors.documentCount ? "error" : ""}`}
            />
            {/* Сообщение об ошибке */}
      <div className={`error-message ${errors.documentCount ? "active" : ""}`}>
        {errors.documentCount}
      </div>
          </div>

          <div className="form-group">
            <label htmlFor="date-range">Диапазон поиска *</label>
            <div className="date-range">
              <input
                type="date"
                id="start-date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`input-field ${errors.startDate ? "error" : ""}`}
              />
              <span>—</span>
              <input
                type="date"
                id="end-date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`input-field ${errors.endDate ? "error" : ""}`}
              />
            </div>
            {/* Отображаем ошибку, если есть ошибка в startDate или endDate */}
            {errors.startDate || errors.endDate ? (
             <div className="error-message active">{errors.startDate || errors.endDate}</div>
            ) : null}
          </div>
        </div>

        <div className="form-right">
          <div className="checkbox-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="fullness"
                name="fullness"
                checked={formData.fullness}
                onChange={handleInputChange}
              />
              <label htmlFor="fullness" className={formData.fullness ? "" : "inactive"}>
                Признак максимальной полноты
              </label>
              {formData.fullness && <img src={checkIcon} alt="Галочка" className="check-icon" />}
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="business-context"
                name="businessContext"
                checked={formData.businessContext}
                onChange={handleInputChange}
              />
              <label htmlFor="business-context" className={formData.businessContext ? "" : "inactive"}>
                Упоминания в бизнес-контексте
              </label>
              {formData.businessContext && <img src={checkIcon} alt="Галочка" className="check-icon" />}
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="main-role"
                name="mainRole"
                checked={formData.mainRole}
                onChange={handleInputChange}
              />
              <label htmlFor="main-role" className={formData.mainRole ? "" : "inactive"}>
                Главная роль в публикации
              </label>
              {formData.mainRole && <img src={checkIcon} alt="Галочка" className="check-icon" />}
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="risk-factors"
                name="riskFactors"
                checked={formData.riskFactors}
                onChange={handleInputChange}
              />
              <label htmlFor="risk-factors" className={formData.riskFactors ? "" : "inactive"}>
                Публикации только с риск-факторами
              </label>
              {formData.riskFactors && <img src={checkIcon} alt="Галочка" className="check-icon" />}
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="include-tech-news"
                name="includeTechNews"
                checked={formData.includeTechNews}
                onChange={handleInputChange}
              />
              <label htmlFor="include-tech-news" className={formData.includeTechNews ? "" : "inactive"}>
                Включать технические новости рынков
              </label>
              {formData.includeTechNews && <img src={checkIcon} alt="Галочка" className="check-icon" />}
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="include-announcements"
                name="includeAnnouncements"
                checked={formData.includeAnnouncements}
                onChange={handleInputChange}
              />
              <label htmlFor="include-announcements" className={formData.includeAnnouncements ? "" : "inactive"}>
                Включать анонсы и календари
              </label>
              {formData.includeAnnouncements && <img src={checkIcon} alt="Галочка" className="check-icon" />}
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="include-summaries"
                name="includeSummaries"
                checked={formData.includeSummaries}
                onChange={handleInputChange}
              />
              <label htmlFor="include-summaries" className={formData.includeSummaries ? "" : "inactive"}>
                Включать сводки новостей
              </label>
              {formData.includeSummaries && <img src={checkIcon} alt="Галочка" className="check-icon" />}
            </div>
          </div>
        </div>

        <div className="search-button-container">
        <button
            type="submit"
                className="search-button"
                    disabled={!validateForm()} // Блокируем кнопку, если форма не валидна или идет загрузка
                >
               Поиск

        </button>
         <span className="required-note">* Обязательные к заполнению поля</span>

        </div>

      </form>

    </div>
  );
};

export default SearchForm;

