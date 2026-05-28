import { BackButtonComponent } from "../../components/back-button/index.js";
import { ProductComponent } from "../../components/product/index.js";
import { ToastComponent } from "../../components/toast/index.js";
import { MainPage } from "../main/index.js";
import { api } from "../../modules/api.js";
import { stockUrls } from "../../modules/stockUrls.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    get pageRoot() {
        return document.getElementById('product-page');
    }

    getHTML() {
        return `
            <div id="product-page" class="container py-4">
                <div id="product-loading" style="color: rgba(255,255,255,0.6); text-align:center; margin-top:40px;">
                    Загрузка...
                </div>
            </div>
        `;
    }

    async getData() {
        try {
            const data = await api.get(stockUrls.getStockById(this.id));
            const loading = document.getElementById('product-loading');
            if (loading) loading.style.display = 'none';
            this.renderData(data);
        } catch (e) {
            console.error('Ошибка получения карточки:', e);
            const loading = document.getElementById('product-loading');
            if (loading) loading.textContent = 'Карточка не найдена';
        }
    }

    renderData(item) {
        const row = document.createElement('div');
        row.className = 'row justify-content-center';
        this.pageRoot.appendChild(row);

        const col = document.createElement('div');
        col.className = 'col-md-6';
        row.appendChild(col);

        const product = new ProductComponent(col);
        product.render(item);

        const toast = new ToastComponent(this.pageRoot);
        setTimeout(() => {
            toast.show(`Вы просматриваете: ${item.title}`);
        }, 100);
    }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    render() {
        this.parent.innerHTML = '';

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

        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack.bind(this));

        this.getData();
    }
}
