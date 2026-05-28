const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit'); // подключаем пакет
const stocksRouter = require('./routes/stocks');
const stocksService = require('./services/stocksService');

const app = express();
const PORT = 3000;

// Путь к файлу с данными
const DATA_FILE_PATH = path.join(__dirname, 'data/stocks.json');
stocksService.init(DATA_FILE_PATH);

// ========== РАЗДАЧА СТАТИКИ (фронтенд из лабы 6) ==========
app.use(express.static(path.join(__dirname, '../public')));

// ========== НАСТРОЙКА RATE LIMITING ==========

// 1. Общий лимитер для всех маршрутов API
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100,                 // максимум 100 запросов с одного IP
  message: { error: 'Слишком много запросов с вашего IP, попробуйте позже.' },
  statusCode: 429,
  standardHeaders: true,    // возвращать современные заголовки RateLimit-*
  legacyHeaders: false,     // не использовать устаревшие X-RateLimit-*
});

// 2. Более строгий лимитер для чувствительных операций (POST, PATCH, DELETE)
const strictLimiter = rateLimit({
  windowMs: 60 * 1000,      // 1 минута
  max: 10,                  // не более 10 запросов в минуту
  message: { error: 'Превышен лимит запросов на изменение данных. Подождите минуту.' },
  keyGenerator: (req) => req.ip, // можно заменить на userId, если есть аутентификация
});

// ========== MIDDLEWARE ==========

// Парсинг JSON (должен быть до rate limiting, чтобы не ломать чтение тела)
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Применяем общий лимитер ко всем маршрутам (включая /stocks)
app.use(globalLimiter);

// Для маршрутов изменения данных применяем дополнительный строгий лимитер
// Важно: эти middleware выполняются последовательно, поэтому строгий лимитер
// сработает только для указанных методов
app.use('/stocks', (req, res, next) => {
  if (['POST', 'PATCH', 'DELETE'].includes(req.method)) {
    return strictLimiter(req, res, next);
  }
  next();
});

// Подключаем роутер stocks (все маршруты /stocks)
app.use('/stocks', stocksRouter);

// ========== ОБРАБОТКА ОШИБОК ==========

// 404 — маршрут не найден
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Глобальный обработчик ошибок (включая ошибки rate limiting, если они не были перехвачены ранее)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// ========== ЗАПУСК СЕРВЕРА ==========
app.listen(PORT, () => {
  console.log(`Сервер запущен по адресу http://localhost:${PORT}`);
});
