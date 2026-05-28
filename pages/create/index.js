import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";
import { api } from "../../modules/api.js";
import { stockUrls } from "../../modules/stockUrls.js";

export class CreatePage {
    constructor(parent) {
        this.parent = parent;
    }

    get pageRoot() {
        return document.getElementById('create-page');
    }

    getHTML() {
        return `
            <div id="create-page" class="container py-4">
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <div class="card" style="
                            background: rgba(255,255,255,0.1);
                            backdrop-filter: blur(10px);
                            border: 1px solid rgba(255,255,255,0.2);
                            border-radius: 24px;
                            color: white;
                        ">
                            <div class="card-body p-4">
                                <h5 class="card-title mb-4" style="color: white;">Новая акция</h5>

                                <div class="mb-3">
                                    <label style="color: rgba(255,255,255,0.8); font-size: 0.9rem; margin-bottom: 6px; display: block;">
                                        URL изображения
                                    </label>
                                    <input type="text" id="create-src" class="form-control"
                                        placeholder="https://example.com/image.png"
                                        style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 12px; color: white; padding: 10px 14px;"
                                    />
                                </div>

                                <div class="mb-3">
                                    <label style="color: rgba(255,255,255,0.8); font-size: 0.9rem; margin-bottom: 6px; display: block;">
                                        Название
                                    </label>
                                    <input type="text" id="create-title" class="form-control"
                                        placeholder="Название акции"
                                        style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 12px; color: white; padding: 10px 14px;"
                                    />
                                </div>

                                <div class="mb-4">
                                    <label style="color: rgba(255,255,255,0.8); font-size: 0.9rem; margin-bottom: 6px; display: block;">
                                        Описание
                                    </label>
                                    <textarea id="create-text" class="form-control" rows="3"
                                        placeholder="Описание акции"
                                        style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 12px; color: white; padding: 10px 14px; resize: none;"
                                    ></textarea>
                                </div>

                                <div id="create-error" style="display:none; color: #ff6b6b; font-size: 0.85rem; margin-bottom: 12px;"></div>

                                <button id="save-btn" class="btn w-100" style="
                                    background: #7545E0;
                                    border: none;
                                    border-radius: 16px;
                                    color: white;
                                    padding: 12px;
                                    font-size: 1rem;
                                ">Сохранить</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async saveCard() {
        const src = document.getElementById('create-src').value.trim();
        const title = document.getElementById('create-title').value.trim();
        const text = document.getElementById('create-text').value.trim();
        const errorEl = document.getElementById('create-error');
        const saveBtn = document.getElementById('save-btn');

        if (!src || !title || !text) {
            errorEl.textContent = 'Заполните все поля';
            errorEl.style.display = 'block';
            return;
        }

        errorEl.style.display = 'none';
        saveBtn.disabled = true;
        saveBtn.textContent = 'Сохранение...';

        try {
            await api.post(stockUrls.createStock(), { src, title, text });
            const mainPage = new MainPage(this.parent);
            mainPage.render();
        } catch (e) {
            console.error('Ошибка сохранения:', e);
            errorEl.textContent = 'Ошибка при сохранении. Попробуйте ещё раз.';
            errorEl.style.display = 'block';
            saveBtn.disabled = false;
            saveBtn.textContent = 'Сохранить';
        }
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

        document.getElementById('save-btn').addEventListener('click', this.saveCard.bind(this));
    }
}
