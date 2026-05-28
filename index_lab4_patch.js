const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const stocksRouter = require('./routes/stocks');
const stocksService = require('./services/stocksService');

const app = express();
const PORT = 3000;

const DATA_FILE_PATH = path.join(__dirname, 'data/stocks.json');
stocksService.init(DATA_FILE_PATH);

// ========== РАЗДАЧА СТАТИКИ (фронтенд из лабы 6) ==========
// Папку public скопировать из лабы 6 в корень лабы 4
app.use(express.static(path.join(__dirname, 'public')));

// ========== НАСТРОЙКА RATE LIMITING ==========
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Слишком много запросов с вашего IP, попробуйте позже.' },
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
});

const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Превышен лимит запросов на изменение данных. Подождите минуту.' },
  keyGenerator: (req) => req.ip,
});

// ========== MIDDLEWARE ==========
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(globalLimiter);

app.use('/stocks', (req, res, next) => {
  if (['POST', 'PATCH', 'DELETE'].includes(req.method)) {
    return strictLimiter(req, res, next);
  }
  next();
});

app.use('/stocks', stocksRouter);

// ========== ОБРАБОТКА ОШИБОК ==========
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// ========== ЗАПУСК СЕРВЕРА ==========
app.listen(PORT, () => {
  console.log(`Сервер запущен по адресу http://localhost:${PORT}`);
});
