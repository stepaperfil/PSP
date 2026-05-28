# Лабораторная работа №4 — REST API на Node.js + Express

## Содержание

1. [Задание](#задание)
2. [Цель](#цель)
3. [Вариант и референсы](#вариант-и-референсы)
4. [Реализация](#реализация)
5. [Дополнительные задания](#дополнительные-задания)
6. [Как запустить](#как-запустить)
7. [Структура проекта](#структура-проекта)

---

## Задание

Реализация на Node.js собственного веб-сервиса для API, данные хранятся в JSON-файле. Тестирование через Postman — 5 методов: список с фильтрацией, получение одной записи, добавление, редактирование, удаление.

---

## Цель

Познакомиться с серверной разработкой на Node.js и Express. Реализовать REST API с архитектурой MVC (роутер → контроллер → сервис). Научиться тестировать API через Postman.

---

## Вариант и референсы

**Тема:** Банк Точка — акции и предложения  
**Студент:** Перфильев С.М., группа ИУ5-45Б  
**Задание:** [Туториал №4](https://github.com/iu5git/JavaScript/blob/main/tutorials/backend/example-expressjs/README.md)

---

## Реализация

API построено по архитектуре MVC: `routes/stocks.js` → `controllers/stocksController.js` → `services/stocksService.js`. Данные хранятся в `src/data/stocks.json` и читаются/записываются через `fileService.js`.

**Endpoints:**

| Метод | URL | Описание | Коды ответа |
|-------|-----|----------|-------------|
| GET | `/stocks` | Список всех акций (с фильтром `?title=`) | 200 |
| GET | `/stocks/:id` | Одна акция по ID | 200, 404 |
| POST | `/stocks` | Создать акцию | 201, 400 |
| PATCH | `/stocks/:id` | Обновить акцию | 200, 404 |
| DELETE | `/stocks/:id` | Удалить акцию | 204, 404 |

---

## Дополнительные задания

### Доп. вопрос 1 — Роутер: все маршруты в одном месте

Все маршруты описаны в `routes/stocks.js`. Express Router позволяет группировать маршруты по ресурсу и подключать их в `index.js` одной строкой.

```javascript
const express = require('express');
const router = express.Router();
const stocksController = require('../controllers/stocksController');

router.get('/', stocksController.getAllStocks);
router.get('/:id', stocksController.getStockById);
router.post('/', stocksController.createStock);
router.patch('/:id', stocksController.updateStock);
router.delete('/:id', stocksController.deleteStock);

module.exports = router;
```

### Доп. вопрос 2 — Добавление нового элемента с автоинкрементом ID

Сервис читает текущий массив из JSON, вычисляет новый ID как максимальный существующий + 1, добавляет запись и сохраняет файл обратно.

```javascript
const create = (stockData) => {
    const stocks = fileService.readData(dataFilePath);

    const newId = stocks.length > 0
        ? Math.max(...stocks.map(s => s.id)) + 1
        : 1;

    const newStock = { id: newId, ...stockData };
    stocks.push(newStock);
    fileService.writeData(dataFilePath, stocks);

    return newStock;
};
```

Контроллер проверяет наличие всех полей и возвращает `201 Created`:

```javascript
const createStock = (req, res) => {
    const { src, title, text } = req.body;

    if (!src || !title || !text) {
        return res.status(400).json({ error: 'Не все поля заполнены' });
    }

    const newStock = stocksService.create({ src, title, text });
    res.status(201).json(newStock);
};
```

### Доп. вопрос 3 — Rate Limiting: защита от перегрузки

Добавлены два лимитера через `express-rate-limit`. Общий — 100 запросов за 15 минут для всех маршрутов. Строгий — 10 запросов в минуту только для методов изменения данных (POST, PATCH, DELETE).

```javascript
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Слишком много запросов с вашего IP, попробуйте позже.' },
    statusCode: 429,
});

const strictLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { error: 'Превышен лимит запросов на изменение данных.' },
});

app.use(globalLimiter);

app.use('/stocks', (req, res, next) => {
    if (['POST', 'PATCH', 'DELETE'].includes(req.method)) {
        return strictLimiter(req, res, next);
    }
    next();
});
```

---

## Как запустить

```bash
npm install
npm run start
```

Сервер запустится на `http://localhost:3000`.

Для разработки с автоперезагрузкой:
```bash
npm run dev
```

---

## Структура проекта

```
example-express/
├── package.json
└── src/
    ├── index.js                  # Точка входа, настройка Express
    ├── data/
    │   └── stocks.json           # Файл с данными
    ├── routes/
    │   └── stocks.js             # Роутер
    ├── controllers/
    │   └── stocksController.js   # Контроллеры (обработка запросов)
    └── services/
        ├── stocksService.js      # Бизнес-логика (CRUD)
        └── fileService.js        # Чтение/запись JSON-файла
```
