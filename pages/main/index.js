import { ProductCardComponent } from "../../components/product-card/index.js";
import { FilterComponent } from "../../components/filter/index.js";
import { api } from "../../modules/api.js";
import { stockUrls } from "../../modules/stockUrls.js";

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
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 style="color: white; margin: 0;">Акции и предложения</h4>
                    <button id="add-card-btn" class="btn" style="
                        background: rgba(255,255,255,0.15);
                        border: 1px solid rgba(255,255,255,0.3);
                        border-radius: 16px;
                        color: white;
                        padding: 8px 20px;
                    ">+ Добавить</button>
                </div>
                <div id="cards-row" class="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
                </div>
                <div id="empty-msg" style="display:none; color: rgba(255,255,255,0.6); text-align:center; margin-top:40px;">
                    Карточки не найдены
                </div>
                <div id="loading-msg" style="color: rgba(255,255,255,0.6); text-align:center; margin-top:40px;">
                    Загрузка...
                </div>
            </div>
        `;
    }

    async getData(title) {
        try {
            const data = await api.get(stockUrls.getStocks(title));
            this.renderData(data);
        } catch (e) {
            console.error('Ошибка получения данных:', e);
            this.showEmpty();
        }
    }

    renderData(items) {
        const row = document.getElementById('cards-row');
        const loadingMsg = document.getElementById('loading-msg');
        const emptyMsg = document.getElementById('empty-msg');

        if (loadingMsg) loadingMsg.style.display = 'none';
        row.innerHTML = '';

        if (items.length === 0) {
            if (emptyMsg) emptyMsg.style.display = 'block';
            return;
        }

        if (emptyMsg) emptyMsg.style.display = 'none';

        items.forEach((item) => {
            const col = document.createElement('div');
            col.className = 'col';
            row.appendChild(col);
            const productCard = new ProductCardComponent(col);
            productCard.render(item, this.clickCard.bind(this));
        });
    }

    showEmpty() {
        const loadingMsg = document.getElementById('loading-msg');
        const emptyMsg = document.getElementById('empty-msg');
        if (loadingMsg) loadingMsg.style.display = 'none';
        if (emptyMsg) emptyMsg.style.display = 'block';
    }

    clickCard(e) {
        const cardId = e.target.dataset.id;
        import('../product/index.js').then(({ ProductPage }) => {
            const productPage = new ProductPage(this.parent, cardId);
            productPage.render();
        });
    }

    clickAddCard() {
        import('../create/index.js').then(({ CreatePage }) => {
            const createPage = new CreatePage(this.parent);
            createPage.render();
        });
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

        const filterContainer = document.createElement('div');
        this.pageRoot.insertBefore(filterContainer, this.pageRoot.firstChild);
        const filter = new FilterComponent(filterContainer);
        filter.render((title) => this.getData(title));

        document.getElementById('add-card-btn').addEventListener('click', this.clickAddCard.bind(this));

        this.getData('');
    }
}
