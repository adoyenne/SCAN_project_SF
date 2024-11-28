import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // Импорт контекста
import { useLocation, useNavigate } from "react-router-dom";
import rightArrow from "../images/icons8-шеврон-вправо-90_1.svg";
import girlImage from "../images/Group_1171274267.svg";
import "../styles/SearchResults.css";
import spinnerImageres from "../images/icons8-спиннер,-кадр-5-100_1.svg";

const SearchResults = () => {
  const {accessToken } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const { requestData, isLoading: initialLoading } = location.state || {};
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [apiResponse, setApiResponse] = useState(null);
  const [currentResults, setCurrentResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [documentIds, setDocumentIds] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (!requestData || !accessToken) {
      navigate("/search");
      return; // Предотвращаем выполнение дальнейшего кода, если requestData нет
    }

    // Fetch initial data
    const fetchData = async () => {
      try {
        const histogramResponse = await axios.post(
          "https://gateway.scan-interfax.ru/api/v1/objectsearch/histograms",
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setApiResponse(histogramResponse.data);
        setTotalCount(histogramResponse.data.totalCount || 0);
        setCurrentResults(histogramResponse.data.results?.slice(0, 10) || []);


      // Запрос ID публикаций
      const idResponse = await axios.post(
        "https://gateway.scan-interfax.ru/api/v1/objectsearch",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );



      const documentIds = idResponse.data.items.map((item) => item.encodedId);
      setDocumentIds(documentIds);

      console.log("documentIds:", documentIds);

      // Используем первые 10 ID для начальной загрузки
        if (documentIds.length > 0) {
          fetchDocuments(documentIds.slice(0, 2)); // Получаем первые 2 ID
        }



      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setIsLoading(false);
    }
  };

  fetchData();
}, [requestData, navigate]);



  // Функция для получения документов
  const fetchDocuments = async (ids) => {
    try {
      const response = await axios.post(
        "https://gateway.scan-interfax.ru/api/v1/documents",
        { ids },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const successfulDocs = response.data.filter((item) => item.ok);
      setDocuments((prev) => [...prev, ...successfulDocs]);

    } catch (error) {
      console.error("Error fetching documents", error);
    }
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const idsBatch = documentIds.slice(page * 2, (page + 1) * 2);
    if (idsBatch.length > 0) {
      await fetchDocuments(idsBatch);
    }
    setPage(nextPage);
  };

 const renderTags = (attributes) => {
  if (!attributes) {
    return <span className="tag">Без тегов</span>;
  }

  const tagMapping = [
    { key: "isTechNews", className: "tech-news", label: "Технические новости" },
    { key: "isAnnouncement", className: "announcement", label: "Анонсы" },
    { key: "isDigest", className: "digest", label: "Сводки новостей" },
  ];

  const tags = tagMapping
    .filter(({ key }) => attributes[key]) // Проверяем, что атрибут существует и имеет значение `true`
    .map(({ className, label }) => (
      <span key={className} className={`tag ${className}`}>
        {label}
      </span>
    ));

  return tags.length > 0 ? tags : <span className="tag">Без тегов</span>;
};

const renderTitle = (title) => {
  return title?.text || "Заголовок недоступен";
};

const decodeHTMLEntities = (text) => {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
};

// Функция для исправления относительных путей
const fixRelativePaths = (node, baseUrl) => {
  const attributesToFix = ["src", "href", "xlink:href"];

  attributesToFix.forEach((attr) => {
    const attrValue = node.getAttribute(attr);
    if (attrValue && !attrValue.startsWith("http")) {
      const fullPath = `${baseUrl}${attrValue}`;
      console.log(`Fixing path for ${attr}: ${attrValue} -> ${fullPath}`);
      node.setAttribute(attr, fullPath);
    }
  });

  // Если это SVG-элемент, и у него есть атрибут 'xlink:href' или 'href'
  if (node.nodeName === "svg") {
    const iconHref = node.getAttribute("xlink:href") || node.getAttribute("href");
    if (iconHref && !iconHref.startsWith("http")) {
      const fullIconPath = `${baseUrl}${iconHref}`;
      console.log(`Fixing SVG path: ${iconHref} -> ${fullIconPath}`);
      node.setAttribute("xlink:href", fullIconPath); // Обновляем xlink:href
      node.setAttribute("href", fullIconPath); // Обновляем href, если используется
    }
  }
};

const getBaseUrl = (url) => {
  if (!url || typeof url !== "string") {
    return ""; // Возвращаем пустую строку или null в случае ошибки
  }

  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.protocol}//${parsedUrl.host}`;
  } catch (error) {
    return ""; // Возвращаем пустую строку в случае ошибки
  }
};

const renderContent = (markup, sourceBaseUrl, maxLines = 10) => {
  if (!markup) return "Содержимое недоступно";

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(markup, "application/xml");

    // Проверяем ошибки парсинга
    const parseError = doc.querySelector("parsererror");
    if (parseError) {
      console.error("Ошибка парсинга XML:", parseError.textContent);
      return "Ошибка обработки содержимого";
    }

    // Извлекаем элементы и исправляем пути
    const content = Array.from(doc.querySelectorAll("sentence, h2, p, img, div, svg"))
      .slice(0, maxLines) // Ограничиваем количество элементов
      .map((node) => {
        // Исправляем пути для каждого элемента
        fixRelativePaths(node, sourceBaseUrl);

        switch (node.nodeName) {
          case "sentence":
          case "p":
            return `<p>${node.textContent.trim()}</p>`;
          case "h2":
            return `<h2>${node.textContent.trim()}</h2>`;
          case "img": {
            const src = node.getAttribute("src");
            const fullSrc = src?.startsWith("http") ? src : `${sourceBaseUrl}${src}`;
            return `<img src="${fullSrc}" alt="${node.getAttribute("alt") || "image"}" />`;
          }
          case "svg":
            // Возвращаем сам SVG, если это <svg>
            return node.outerHTML; // Можно адаптировать для работы с самими SVG
          default:
            return "";
        }
      });

    console.log("Base URL:", sourceBaseUrl);
    console.log("Final Content:", content.join(""));

    return content.join("");
  } catch (error) {
    console.error("Ошибка обработки контента:", error);
    return "Ошибка обработки содержимого";
  }
};

const renderWordCount = (doc) => {
  // Проверка на существование attributes и wordCount
  return doc?.attributes?.wordCount ? doc.attributes.wordCount : "Не указано";
};

  const totalDocumentsData =
    apiResponse?.data?.find((item) => item.histogramType === "totalDocuments")
      ?.data || [];
  const riskFactorsData =
    apiResponse?.data?.find((item) => item.histogramType === "riskFactors")
      ?.data || [];

  const combinedData = totalDocumentsData.map((item, index) => ({
    date: new Date(item.date).toLocaleDateString(),
    total: item.value,
    risks: riskFactorsData[index]?.value || 0,
  }));



  const handleScroll = (direction) => {
  const step = 150; // Шаг сдвига

  // Для сдвига вправо (право на самом деле уменьшает текущий сдвиг)
  if (direction === "left" && currentOffset > 0) {
    setCurrentOffset(currentOffset - step);
  }

  // Для сдвига влево (влево увеличивает текущий сдвиг)
  else if (
    direction === "right" &&
    currentOffset < (combinedData.length * 150 - 1260) &&
    currentOffset + step <= (combinedData.length * 150 - 1260)
  ) {
    setCurrentOffset(currentOffset + step); // Сдвигаем вправо
  }
};


    // Подсчёт общего количества вариантов
  const totalRecords = combinedData.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="search-results">
      <img src={girlImage} alt="Girl Illustration" className="img-girl" />

      <div className="text-container">
        <h1>Ищем. Скоро будут результаты</h1>
        <p>Поиск может занять некоторое время, просим сохранять терпение.</p>
      </div>

      <div className="search-message-container">
        <h2>Общая сводка</h2>
        <p>Найдено {totalRecords} вариантов</p>
      </div>

      <div className="carousel">
        <div className="sidebar">
            <p>Период</p>
            <p>Всего</p>
            <p>Риски</p>
        </div>

        {isLoading ? (
            <div className="loading-container">
            <img src={spinnerImageres} alt="loading" className="loader-spin-res" />
            </div>
        ) : (
         <div
      className="carousel-content"
      style={{ transform: `translateX(-${currentOffset}px)` }}
        >
      {combinedData.map((item, index) => (
        <div className="carousel-column" key={index}>
          <p>{item.date}</p>
          <p>{item.total}</p>
          <p>{item.risks}</p>
        </div>
            ))}
            </div>
            )}
            </div>


      <div className="arrow-container">
        <img
          src={rightArrow}
          alt="Left Arrow"
          className={`arrow left ${currentOffset === 0 ? "disabled" : ""}`}
          onClick={() => handleScroll("left")}
          style={{ transform: "rotate(180deg)" }}
        />
        <img
          src={rightArrow}
          alt="Right Arrow"
          className={`arrow right ${
            currentOffset >= Math.max(0, combinedData.length * 150 - 1260)
              ? "disabled"
              : ""
          }`}
          onClick={() => handleScroll("right")}
        />
      </div>

<div>
    <h1 className="list-title">Список документов</h1>
</div>
<div className="cards-container">
  {documents.length > 0 ? (
    <>
      {/* Карточки документов */}
      {documents.map((document, index) => {
        const doc = document.ok;
        console.log("Рендер документа:", doc);

        return (
          <div key={index} className="document-card">
            {/* Шапка карточки */}
            <div className="card-header">
              <span className="publish-date">
                {doc.issueDate
                  ? new Date(doc.issueDate).toLocaleDateString()
                  : "Дата не указана"}
              </span>
              {doc.source && doc.source.name ? (
                <a
                  className="source-link"
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {doc.source.name}
                </a>
              ) : (
                <span className="source-link">Источник не указан</span>
              )}
            </div>

            {/* Заголовок публикации */}
            <h3 className="document-title">{renderTitle(doc.title)}</h3>

            {/* Теги */}
            <div className="tags">{renderTags(doc.attributes)}</div>

            {/* Содержимое документа */}
            <div
              className="document-content"
              dangerouslySetInnerHTML={{
                __html: renderContent(doc.content?.markup, getBaseUrl(doc.url || "")),
              }}
            />

            {/* Кнопка "Читать в источнике" и количество слов */}
            <div className="card-footer">
              <a
                className="source-button"
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Читать в источнике
              </a>
              <span className="word-count">{renderWordCount(doc)} слова</span>
            </div>
          </div>
        );
      })}

      {/* Кнопка для загрузки ещё документов */}
      <div className="load-more-container">
        <button className="load-more-button" onClick={handleLoadMore}>
          <span className="load-more-text">Показать больше</span>
        </button>
      </div>
    </>
  ) : (
    <div className="loading-container">
      <img
        src={spinnerImageres}
        alt="loading"
        className="loader-spin-res"
      />
    </div>
  )}
</div>
    </div>
  );
};

export default SearchResults;