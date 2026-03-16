import { BackButtonComponent } from "../../components/back-button/index.js";
import { ProductComponent } from "../../components/product/index.js";
import { ToastComponent } from "../../components/toast/index.js";
import { MainPage } from "../main/index.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    get pageRoot() {
        return document.getElementById('product-page');
    }

    getHTML() {
        return '<div id="product-page" class="container py-4"></div>';
    }

    getData() {
        const products = {
            1: {
                id: 1,
                src: "https://cdn-icons-png.flaticon.com/512/2830/2830285.png",
                title: "Кредитная карта «120 дней»",
                text: "Льготный период 120 дней · Ставка от 11.9% · Кэшбэк 1% · Лимит до 1 млн ₽"
            },
            2: {
                id: 2,
                src: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                title: "Накопительный счёт",
                text: "До 8% на остаток · Пополнение без комиссии · Снятие в любой момент · Страхование вклада"
            },
            3: {
                id: 3,
                src: "https://cdn-icons-png.flaticon.com/512/2331/2331966.png",
                title: "Дебетовая карта «Мир»",
                text: "Бесплатное обслуживание · Кэшбэк до 5% у партнёров · Снятие без процентов · Мгновенный выпуск"
            }
        };
        return products[this.id] || {
            id: this.id,
            src: "",
            title: "Неизвестный продукт",
            text: "Описание отсутствует"
        };
    }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack.bind(this));

        const data = this.getData();

        const row = document.createElement('div');
        row.className = 'row justify-content-center';
        this.pageRoot.appendChild(row);
        const col = document.createElement('div');
        col.className = 'col-md-6';
        row.appendChild(col);

        const product = new ProductComponent(col);
        product.render(data);

        const toast = new ToastComponent(this.pageRoot);
        setTimeout(() => {
            toast.show(`Вы просматриваете: ${data.title}`);
        }, 100);
    }
}
