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
                src: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", // иконка вклада
                title: "Накопительный счёт",
                text: "До 8% на остаток · Пополнение без комиссии · Снятие в любой момент"
            },
            {
                id: 3,
                src: "https://cdn-icons-png.flaticon.com/512/2331/2331966.png", // иконка карты
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
