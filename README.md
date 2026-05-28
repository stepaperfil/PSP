# Лабораторная работа №5 — XHR запросы, AJAX, CORS

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

Продолжение лабораторной работы 3: добавить страницу добавления/редактирования и кнопку «+ Добавить». Подключить фронтенд к API из лабы 4 через XHR-запросы. CORS обходить через расширение браузера CORS Unblock. Кнопка «Сохранить» в лабе 5 отсутствует — появляется в лабе 6.

---

## Цель

Познакомиться с AJAX и XHR: научиться делать асинхронные запросы к серверу без перезагрузки страницы. Увидеть проблему CORS на практике и понять способы её решения.

---

## Вариант и референсы

**Тема:** Банк Точка ([tochka.com](https://tochka.com))  
**Студент:** Перфильев С.М., группа ИУ5-45Б  
**Задание:** [Туториал №5 (AJAX)](https://github.com/iu5git/JavaScript/blob/main/tutorials/ajax/README.md)

---

## Реализация

Фронтенд расширяет лабу 3: данные больше не берутся из mock-массива, а загружаются с бэкенда (лаба 4, `localhost:3000`) через XHR.

Добавлены два новых модуля: `modules/ajax.js` — обёртка над `XMLHttpRequest`, и `modules/stockUrls.js` — хранит все URL к API. Добавлены: компонент фильтрации `components/filter/` и страница создания карточки `pages/create/`.

---

## Дополнительные задания

### Доп. вопрос 1 — Класс Ajax: обёртка над XMLHttpRequest

Вместо того чтобы каждый раз писать `new XMLHttpRequest()` вручную, создан класс `Ajax` с методами `get`, `post`, `patch`, `delete`. Каждый метод открывает соединение, отправляет запрос и при `readyState === 4` вызывает callback с данными и статусом.

```javascript
class Ajax {
    get(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this._handleResponse(xhr, callback);
            }
        };
    }

    _handleResponse(xhr, callback) {
        try {
            const data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
            callback(data, xhr.status);
        } catch (e) {
            console.error('Ошибка парсинга JSON:', e);
            callback(null, xhr.status);
        }
    }
}

export const ajax = new Ajax();
```

### Доп. вопрос 2 — Фильтрация через query-параметр

При вводе текста в поле фильтра XHR-запрос уходит на `/stocks?title=...`. Бэкенд фильтрует по полю `title` и возвращает только подходящие карточки. Это демонстрируется во вкладке Network → XHR.

```javascript
getData(title) {
    ajax.get(stockUrls.getStocks(title), (data, status) => {
        if (status === 200 && Array.isArray(data)) {
            this.renderData(data);
        } else {
            console.error('Ошибка получения данных:', status, data);
            this.showEmpty();
        }
    });
}

// В stockUrls.js:
getStocks(title) {
    if (title) {
        return `${this.baseUrl}/stocks?title=${encodeURIComponent(title)}`;
    }
    return `${this.baseUrl}/stocks`;
}
```

### Доп. вопрос 3 — Страница создания карточки (без сохранения)

Страница `pages/create/index.js` содержит три поля ввода: URL изображения, название и описание. Кнопки «Сохранить» нет — она появится в лабе 6. Страница открывается по кнопке «+ Добавить» на главной.

```javascript
export class CreatePage {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return `
            <div id="create-page" class="container py-4">
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <div class="card" style="background: rgba(255,255,255,0.1); border-radius: 24px; color: white;">
                            <div class="card-body p-4">
                                <h5 class="card-title mb-4">Новая акция</h5>
                                <input type="text" id="create-src" class="form-control mb-3"
                                    placeholder="URL изображения" />
                                <input type="text" id="create-title" class="form-control mb-3"
                                    placeholder="Название акции" />
                                <textarea id="create-text" class="form-control mb-4"
                                    placeholder="Описание акции" rows="3"></textarea>
                                <p style="color: rgba(255,255,255,0.4); font-size: 0.8rem; text-align: center;">
                                    * Кнопка сохранения будет добавлена в лабораторной работе №6
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
```

---

## Как запустить

**Терминал 1** — бэкенд из лабы 4:
```bash
cd lab4/example-express
npm run start
# сервер на http://localhost:3000
```

**VS Code** — открыть папку лабы 5, правая кнопка на `index.html` → **Open with Live Server**  
Фронт откроется на `http://127.0.0.1:5500`

**Важно:** без включённого расширения CORS Unblock карточки не загрузятся — браузер заблокирует запросы с порта 5500 к порту 3000.

---

## Структура проекта

```
lab5/
├── index.html
├── main.js
├── style.css
├── modules/
│   ├── ajax.js           # Класс Ajax — обёртка над XHR
│   └── stockUrls.js      # URL-адреса к API бэкенда
├── pages/
│   ├── main/index.js     # Главная: список карточек + фильтр
│   ├── product/index.js  # Страница «Подробнее» (XHR по ID)
│   └── create/index.js   # Страница создания (поля без сохранения)
└── components/
    ├── filter/index.js   # Компонент поиска
    ├── product-card/index.js
    ├── product/index.js
    ├── back-button/index.js
    └── toast/index.js
```
