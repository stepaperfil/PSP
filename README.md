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
