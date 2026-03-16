export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="card h-100" style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); border-radius: 24px; color: white; overflow: hidden;">
                <div class="card-body d-flex flex-column p-3">
                    <img class="card-img-top mb-3 align-self-center" src="${data.src}" alt="иконка продукта" style="width: 80px; height: 80px; object-fit: contain;">
                    <h5 class="card-title text-center" style="color: white;">${data.title}</h5>
                    <p class="card-text flex-grow-1 text-center" style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">${data.text}</p>
                    <button class="btn btn-primary mt-auto w-100" id="click-card-${data.id}" data-id="${data.id}"
                            style="background: #7545E0; border: none; border-radius: 16px; padding: 10px;">
                        Подробнее
                    </button>
                </div>
            </div>
        `;
    }

    addListeners(data, listener) {
        const btn = document.getElementById(`click-card-${data.id}`);
        if (btn) {
            btn.addEventListener('click', listener);
        } else {
            console.warn(`Кнопка с id click-card-${data.id} не найдена`);
        }
    }

    render(data, listener) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data, listener);
    }
}
