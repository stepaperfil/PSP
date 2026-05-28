# Лабораторная работа №6 — fetch, промисы, Vite bundler

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

Замена XHR-колбэков на промисы и `fetch`. Сборка фронтенда через Vite bundler. Деплой bundle на сервер с API из лабы 4. Ветка `LAB_6` содержит только исходный код, собранный bundle добавляется в ветку `LAB_4`.

---

## Цель

Познакомиться с современным подходом к асинхронным запросам: `fetch` + `async/await` вместо XHR + колбэков. Научиться собирать фронтенд через bundler (Vite) и деплоить его на Express-сервер как статику.

---

## Вариант и референсы

**Тема:** Банк Точка ([tochka.com](https://tochka.com))  
**Студент:** Перфильев С.М., группа ИУ5-45Б  
**Задание:** [Туториал №6 (fetch)](https://github.com/iu5git/JavaScript/blob/main/tutorials/fetch/README.md)

---

## Реализация

Исходный код идентичен лабе 5 по структуре, но все XHR-запросы заменены на `fetch` с `async/await`. Добавлена кнопка **«Сохранить»** на странице создания — делает POST-запрос и возвращает на главную. `baseUrl` в `stockUrls.js` стал пустой строкой — запросы идут на тот же домен, CORS не нужен.

Сборка через **Vite**: команда `npm run build` собирает все файлы в папку `public/`, которая кладётся в лабу 4. Express раздаёт её как статику через `app.use(express.static(...))`.

---

## Дополнительные задания

### Доп. вопрос 1 — Замена XHR на fetch + async/await

Вместо колбэков и `onreadystatechange` — `async/await` с обработкой ошибок через `try/catch`. Код стал линейным и читаемым.

**Было (лаба 5, XHR):**
```javascript
getData(title) {
    ajax.get(stockUrls.getStocks(title), (data, status) => {
        if (status === 200 && Array.isArray(data)) {
            this.renderData(data);
        }
    });
}
```

**Стало (лаба 6, fetch):**
```javascript
async getData(title) {
    try {
        const data = await api.get(stockUrls.getStocks(title));
        this.renderData(data);
    } catch (e) {
        console.error('Ошибка получения данных:', e);
        this.showEmpty();
    }
}
```

Класс `Api` внутри использует `fetch`:

```javascript
class Api {
    async get(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status}`);
        }
        return response.json();
    }

    async post(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status}`);
        }
        return response.json();
    }
}

export const api = new Api();
```

### Доп. вопрос 2 — Кнопка «Сохранить»: POST через fetch

В лабе 5 кнопки не было. Теперь `saveCard()` валидирует поля, делает POST-запрос и при успехе возвращает на главную страницу.

```javascript
async saveCard() {
    const src = document.getElementById('create-src').value.trim();
    const title = document.getElementById('create-title').value.trim();
    const text = document.getElementById('create-text').value.trim();
    const errorEl = document.getElementById('create-error');
    const saveBtn = document.getElementById('save-btn');

    if (!src || !title || !text) {
        errorEl.textContent = 'Заполните все поля';
        errorEl.style.display = 'block';
        return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'Сохранение...';

    try {
        await api.post(stockUrls.createStock(), { src, title, text });
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    } catch (e) {
        errorEl.textContent = 'Ошибка при сохранении. Попробуйте ещё раз.';
        errorEl.style.display = 'block';
        saveBtn.disabled = false;
        saveBtn.textContent = 'Сохранить';
    }
}
```

### Доп. вопрос 3 — Сборка через Vite и раздача статики

`vite.config.js` указывает папку вывода `public/`:

```javascript
export default {
    build: {
        outDir: './public',
        emptyOutDir: true,
    },
};
```

После `npm run build` папка `public/` копируется в лабу 4. В `src/index.js` лабы 4 добавлена одна строка:

```javascript
app.use(express.static(path.join(__dirname, '../public')));
```

Теперь при открытии `http://localhost:3000` Express отдаёт собранный фронтенд. Запросы к `/stocks` идут на тот же домен — CORS не нужен, расширение выключено.

---

## Как запустить

**Разработка:**
```bash
npm install
npm run dev    # Vite dev-server на http://localhost:5173
```

**Сборка bundle:**
```bash
npm run build  # собирает в папку public/
```

**Деплой:** скопировать папку `public/` в корень лабы 4, запустить лабу 4:
```bash
cd lab4/example-express
npm run start
# открыть http://localhost:3000
```

---

## Структура проекта

```
lab6/                         ← ветка LAB_6 (только исходники)
├── index.html
├── main.js
├── style.css
├── vite.config.js            # конфиг сборщика
├── package.json
├── modules/
│   ├── api.js                # fetch + async/await (замена ajax.js)
│   └── stockUrls.js          # URL к API (baseUrl = '' — same origin)
├── pages/
│   ├── main/index.js
│   ├── product/index.js
│   └── create/index.js       # + кнопка «Сохранить» с POST-запросом
└── components/
    ├── filter/index.js
    ├── product-card/index.js
    ├── product/index.js
    ├── back-button/index.js
    └── toast/index.js

lab4/example-express/         ← ветка LAB_4 (после добавления bundle)
├── src/
│   └── index.js              # + app.use(express.static('../public'))
└── public/                   # собранный bundle из npm run build
    ├── index.html
    └── assets/
```
