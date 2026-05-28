# Лабораторная работа №3 + Домашнее задание — Интерфейс с карточками, three.js

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

**Лаборная работа №3:** Знакомство с node, npm. Вёрстка интерфейса с карточками (страница списка с фильтрацией и страница «Подробнее»), данные через mock-объекты. Кнопка добавления (копирует первую карточку), кнопка удаления, кнопка «Домой» в хедере.

**Домашнее задание:** Работа с коллекциями, функциями, классами. Два задания по варианту, встроенные в приложение лабы 3. 3D-модель банковской карты через three.js на странице «Подробнее».

---

## Цель

Познакомиться с компонентным подходом в JS: разделение на страницы и компоненты. Изучить работу с массивами, объектами, циклами. Подключить three.js для отображения 3D-модели.

---

## Вариант и референсы

**Тема:** Банк Точка ([tochka.com](https://tochka.com))  
**Студент:** Перфильев С.М., группа ИУ5-45Б  
**Задание лабы 3:** [Туториал №3](https://github.com/iu5git/JavaScript/blob/main/tutorials/lab3/README.md)  
**Задание ДЗ:** [Туториал ДЗ](https://github.com/iu5git/JavaScript/blob/main/tutorials/hw1/README.md) · [Three.js](https://github.com/iu5git/JavaScript/blob/main/tutorials/threejs/README.md)

---

## Реализация

Приложение построено на компонентном подходе без фреймворков. Каждая страница и UI-элемент — отдельный класс с методом `render()`. Данные хранятся в mock-массиве внутри `getData()`.

Страницы: `MainPage` (список карточек с бегущей строкой) и `ProductPage` (подробнее + 3D-модель).  
Компоненты: `ProductCardComponent`, `ProductComponent`, `BackButtonComponent`, `ToastComponent`, `ThreeViewerComponent`.

---

## Дополнительные задания

### Доп. вопрос 1 — Задание 1: `fill` и `isEqualObj` (работа с объектами)

`fill` создаёт массив из N копий объекта-шаблона банковского счёта (глубокое копирование через spread). `isEqualObj` рекурсивно сравнивает два объекта — например, два счёта с вложенными лимитами.

```javascript
function fill(arraySize, data) {
    const accountSlots = [];
    for (let i = 0; i < arraySize; i++) {
        accountSlots.push(
            data !== null && typeof data === 'object' ? { ...data } : data
        );
    }
    return accountSlots;
}

// Пример использования:
const accountTemplate = { balance: 0, currency: 'RUB', status: 'новый' };
const accountSlots = fill(3, accountTemplate);
// [{ balance:0, currency:'RUB', status:'новый' }, ...]

function isEqualObj(firstAccount, secondAccount) {
    const firstKeys  = Object.keys(firstAccount);
    const secondKeys = Object.keys(secondAccount);
    if (firstKeys.length !== secondKeys.length) return false;

    for (const key of firstKeys) {
        const firstVal  = firstAccount[key];
        const secondVal = secondAccount[key];
        const bothObjects =
            firstVal  !== null && typeof firstVal  === 'object' &&
            secondVal !== null && typeof secondVal === 'object';
        if (bothObjects) {
            if (!isEqualObj(firstVal, secondVal)) return false;
        } else {
            if (firstVal !== secondVal) return false;
        }
    }
    return true;
}
```

### Доп. вопрос 2 — Задание 2: `canBeRearranged` (цикл с постусловием, массив)

Проверяет, одинаковы ли наборы банковских продуктов двух клиентов (в любом порядке). Используется цикл `do...while` для перебора ключей частотной карты продуктов.

```javascript
function canBeRearranged(firstClientProducts, secondClientProducts) {
    if (firstClientProducts.length !== secondClientProducts.length) {
        return {
            result: false,
            report: `Наборы продуктов не совпадают: ` +
                    `у первого клиента ${firstClientProducts.length} продукт(а/ов), ` +
                    `у второго — ${secondClientProducts.length}.`
        };
    }

    const frequencyMap = {};
    firstClientProducts.forEach(productId => {
        frequencyMap[productId] = (frequencyMap[productId] || 0) + 1;
    });

    const productKeys = Object.keys(frequencyMap);
    let keyIndex = 0;
    let mismatchedProduct = null;

    do {
        const productId = productKeys[keyIndex];
        const countInSecond = secondClientProducts.filter(id => String(id) === productId).length;
        if (frequencyMap[productId] !== countInSecond) {
            mismatchedProduct = productId;
            break;
        }
        keyIndex++;
    } while (keyIndex < productKeys.length);

    const result = mismatchedProduct === null;
    const report = result
        ? ` Наборы совпадают! Портфели клиентов идентичны: [${firstClientProducts.join(', ')}].`
        : ` Наборы не совпадают: расхождение по продукту с ID "${mismatchedProduct}".`;

    return { result, report };
}
```

### Доп. вопрос 3 — Three.js: 3D-модель банковской карты на странице «Подробнее»

Компонент `ThreeViewerComponent` загружает `.glb`-модель через `GLTFLoader`, автоматически масштабирует её и запускает анимационный цикл с `OrbitControls` для вращения мышью.

```javascript
export class ThreeViewerComponent {
    constructor(parentContainer, modelUrl) {
        this.parent = parentContainer;
        this.modelUrl = modelUrl;
    }

    async render() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas, alpha: false });
        this.controls = new OrbitControls(this.camera, canvas);

        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(this.modelUrl);
        this.model = gltf.scene;

        // Автомасштабирование модели
        const box = new THREE.Box3().setFromObject(this.model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.5 / maxDim;
        this.model.scale.set(scale, scale, scale);

        this.scene.add(this.model);

        const animate = () => {
            requestAnimationFrame(animate);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }
}
```

---

## Как запустить

```bash
npm install
```

Открыть `index.html` через Live Server в VS Code (правая кнопка → Open with Live Server).

> Для ДЗ (three.js + GLB-модель) Live Server обязателен — файлы `.glb` не загружаются через `file://`.

---

## Структура проекта

```
lab3+dz/
├── index.html
├── main.js
├── style.css
├── tasks.js                          # ДЗ: функции fill, isEqualObj, canBeRearranged, groupAnagrams
├── package.json
├── models/
│   └── my_model.glb                  # ДЗ: 3D-модель банковской карты
├── pages/
│   ├── main/index.js                 # Страница списка карточек
│   └── product/index.js              # Страница «Подробнее»
└── components/
    ├── product-card/index.js
    ├── product/index.js
    ├── back-button/index.js
    ├── toast/index.js
    └── three-viewer/index.js         # ДЗ: компонент three.js
```
