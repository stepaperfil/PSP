# Лабораторная работа №1 — Калькулятор на HTML и CSS

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

Создание калькулятора. Вёрстка на HTML и CSS. Скопировать 3–5 основных цветов кодами с сайта по выбранной теме (хедер, фон, карточки, кнопки, hover) и ещё 2–3 CSS-свойства (padding, border-radius и т.д.).

---

## Цель

Познакомиться с базовыми технологиями веб-разработки: HTML-разметка, CSS-стилизация, работа с цветами и hover-эффектами. Научиться воспроизводить стилистику реального сайта через инспектор браузера.

---

## Вариант и референсы

**Тема:** Банк Точка ([tochka.com](https://tochka.com))  
**Студент:** Перфильев С.М., группа ИУ5-45Б  
**Задание:** [Туториал к лабораторной работе №1](https://github.com/iu5git/JavaScript/blob/main/tutorials/lab1/README.md)

---

## Реализация

Проект состоит из двух HTML-страниц:

- `calculator.html` — основная страница с калькулятором
- `info.html` — страница с информацией о лабораторной работе

Стилистика воспроизведена с сайта Точка Банк: фиолетовый градиентный фон, белые кнопки с фиолетовым акцентом, тёмный хедер и футер, шрифт TT Norms Pro.

---

## Дополнительные задания

### Доп. вопрос 1 — CSS-переменные для централизованного управления цветами

Все цвета вынесены в CSS-переменные через `:root`, что позволяет менять палитру в одном месте. Цвета сняты с сайта Точка через инспектор браузера.

```css
:root {
    --bg-page: #7545E0;
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.7);
    --border-light: rgba(255, 255, 255, 0.2);
    --border-hover: rgba(255, 255, 255, 0.3);
    --accent: #7545E0;
    --accent-hover: #5a32b0;
    --accent-active: #3f1f8f;
    --execute-bg: #9f7af2;
    --footer-bg: #000000;
}
```

### Доп. вопрос 2 — Hover и active эффекты на кнопках

Реализованы три состояния для каждого типа кнопок: обычное, hover (наведение) и active (нажатие). Добавлена анимация масштаба через `transform: scale`.

```css
.my-btn:hover {
    background: var(--button-bg-hover);
    border-color: var(--border-hover);
    transform: scale(1.05);
}

.my-btn.secondary:hover,
.my-btn.primary:hover {
    background: var(--accent-hover);
    color: var(--white);
    border-color: transparent;
}

.my-btn:active {
    background: var(--button-bg-active);
    border-color: var(--border-active);
    transform: scale(0.98);
}
```

### Доп. вопрос 3 — Подключение фирменного шрифта через @font-face

Подключён оригинальный шрифт банка Точка — TT Norms Pro — через `@font-face` с двумя начертаниями: обычным и жирным.

```css
@font-face {
    font-family: 'TT Norms Pro';
    src: url('TTNormsPro-Regular.woff2') format('woff2');
    font-weight: normal;
}
@font-face {
    font-family: 'TT Norms Pro';
    src: url('TTNormsPro-Medium.woff2') format('woff2');
    font-weight: bold;
}

body {
    font-family: 'TT Norms Pro', Arial, sans-serif;
    background: linear-gradient(135deg, #3a1a6a, #b07cf0);
}
```

---

## Как запустить

Открыть файл `calculator.html` в браузере — установка ничего не требуется.

---

## Структура проекта

```
lab1/
├── calculator.html
├── info.html
├── style.css
├── TTNormsPro-Regular.woff2
└── TTNormsPro-Medium.woff2
```
