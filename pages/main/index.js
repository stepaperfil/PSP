import { ProductCardComponent } from "../../components/product-card/index.js";
import { ProductPage } from "../product/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    get pageRoot() {
        return document.getElementById('main-page');
    }

    getHTML() {
        return `
            <div id="main-page" class="container py-4">
                <div class="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
                    <!-- карточки будут добавляться сюда -->
                </div>
            </div>
        `;
    }

    getData() {
        return [
            {
                id: 1,
                src: "https://cdn-icons-png.flaticon.com/512/2830/2830285.png",
                title: "Кредитная карта «120 дней»",
                text: "Льготный период 120 дней · Ставка от 11.9% · Кэшбэк 1%"
            },
            {
                id: 2,
                src: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                title: "Накопительный счёт",
                text: "До 8% на остаток · Пополнение без комиссии · Снятие в любой момент"
            },
            {
                id: 3,
                src: "https://cdn-icons-png.flaticon.com/512/2331/2331966.png",
                title: "Дебетовая карта «Мир»",
                text: "Бесплатное обслуживание · Кэшбэк до 5% у партнёров · Снятие без процентов"
            }
        ];
    }

    clickCard(e) {
        const cardId = e.target.dataset.id;
        const productPage = new ProductPage(this.parent, cardId);
        productPage.render();
    }

    render() {
        this.parent.innerHTML = '';

        // Бегущая строка (вставка HTML напрямую)
        this.parent.insertAdjacentHTML('beforeend', `
            <div class="marquee-container">
                <div class="marquee-content">
                    <span>🏦 Курс USD: 92.50 ₽ | EUR: 100.20 ₽ | CNY: 12.80 ₽ &nbsp;&nbsp;&nbsp;⭐</span>
                    <span>🔔 Кредитная карта «120 дней» — оформите онлайн!</span>
                    <span>💳 Дебетовая карта «Мир» — кэшбэк до 5%</span>
                    <span>📈 Накопительный счёт — до 8% на остаток</span>
                    <span>✨ Бесплатное обслуживание при выполнении условий</span>
                </div>
            </div>
        `);

        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const data = this.getData();
        if (!Array.isArray(data)) {
            console.error('getData() должна возвращать массив, получено:', data);
            return;
        }

        const row = document.querySelector('#main-page .row');
        data.forEach((item) => {
            const col = document.createElement('div');
            col.className = 'col';
            row.appendChild(col);
            const productCard = new ProductCardComponent(col);
            productCard.render(item, this.clickCard.bind(this));
        });
    }
}
