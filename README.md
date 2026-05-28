# Лабораторная работа №2 — Калькулятор на JavaScript

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

Создание калькулятора. Функции на JavaScript. Реализовать в калькуляторе индивидуальную операцию по теме, функция должна быть встроена в логику калькулятора без дополнительных окон и `alert`.

---

## Цель

Познакомиться с JavaScript: обработка событий, работа с DOM, написание функций. Реализовать логику калькулятора и индивидуальную банковскую операцию.

---

## Вариант и референсы

**Тема:** Банк Точка ([tochka.com](https://tochka.com))  
**Студент:** Перфильев С.М., группа ИУ5-45Б  
**Задание:** [Туториал к лабораторной работе №2](https://github.com/iu5git/JavaScript/blob/main/tutorials/lab2/README.md)

---

## Реализация

Калькулятор реализован на чистом JavaScript без сторонних библиотек. Логика построена на строковом выражении `expression`, которое накапливается при нажатии кнопок и вычисляется функцией `evaluateExpression` при нажатии `=`.

**Индивидуальная операция — кнопка `000`** (быстрый ввод круглых сумм).  
Актуально в контексте банковской темы: при вводе крупных сумм (10 000, 500 000 и т.д.) кнопка `000` позволяет не нажимать ноль три раза подряд. Операция встроена в логику ввода числа без дополнительных окон.

---

## Дополнительные задания

### Доп. вопрос 1 — Индивидуальная операция: кнопка `000`

Кнопка добавляет сразу три нуля к текущему числу. Обрабатывает граничные случаи: не допускает `0000`, корректно работает после оператора.

```javascript
document.getElementById('btn_op_000').onclick = function() {
    if (justEvaluated) {
        expression = preview || '';
        preview = '';
        justEvaluated = false;
    }

    const tokenInfo = getLastToken();
    if (!tokenInfo) {
        expression = '000';
        updatePreview();
        return;
    }

    const { token, start } = tokenInfo;

    if (token === '') {
        expression += '000';
    } else if (token === '0') {
        expression = expression.substring(0, start) + '000';
    } else if (/^0+$/.test(token) && token.length >= 3) {
        return; // не допускаем 0000...
    } else {
        expression = expression.substring(0, start) + token + '000';
    }

    updatePreview();
};
```

### Доп. вопрос 2 — Связь кнопки `=` с кодом: вычисление выражения

При нажатии `=` строка `expression` передаётся в `evaluateExpression`, которая безопасно вычисляет её через `new Function`. Поддерживаются все операции: `+`, `-`, `×`, `/`, `^2`, `√`, `sin`, `cos`, `lg`, `ln`, `!`.

```javascript
document.getElementById('btn_op_equal').onclick = function() {
    if (!expression || justEvaluated) return;
    const result = evaluateExpression(expression);
    if (result && result !== 'Ошибка') {
        expression = result;
        preview = '';
        justEvaluated = true;
    } else {
        expression = 'Ошибка';
        preview = '';
        justEvaluated = true;
    }
    updateDisplay();
};

function evaluateExpression(expr) {
    if (!expr) return null;

    const safeSqrt = (x) => {
        if (x < 0) throw new Error('Корень из отрицательного числа');
        return Math.sqrt(x);
    };

    let evalStr = expr
        .replace(/×/g, '*')
        .replace(/\^2/g, '**2')
        .replace(/√\(/g, 'safeSqrt(')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(');

    try {
        const factorial = (n) => {
            n = Number(n);
            if (n < 0 || !Number.isInteger(n)) return NaN;
            let result = 1;
            for (let i = 2; i <= n; i++) result *= i;
            return result;
        };
        const func = new Function('factorial', 'safeSqrt', 'return ' + evalStr);
        const result = func(factorial, safeSqrt);
        return isFinite(result) ? result.toString() : 'Ошибка';
    } catch {
        return 'Ошибка';
    }
}
```

### Доп. вопрос 3 — Смена темы фона калькулятора

Встроена в логику без alert и дополнительных окон: кнопка 🎨 циклически переключает градиентные фоны прямо на странице.

```javascript
const bgColors = [
    'linear-gradient(135deg, #3a1a6a, #b07cf0)',
    'linear-gradient(135deg, #1e3c72, #2a5298)',
    'linear-gradient(135deg, #4568DC, #B06AB3)',
    'linear-gradient(135deg, #43C6AC, #F8FFAE)',
    'linear-gradient(135deg, #FF512F, #DD2476)'
];
let bgIndex = 0;

document.getElementById('btn_op_bgcolor').onclick = function() {
    bgIndex = (bgIndex + 1) % bgColors.length;
    document.body.style.background = bgColors[bgIndex];
};
```

---

## Как запустить

Открыть файл `calculator.html` в браузере — установка ничего не требуется.

---

## Структура проекта

```
lab2/
├── calculator.html
├── info.html
├── script.js
├── style.css
├── TTNormsPro-Regular.woff2
└── TTNormsPro-Medium.woff2
```
