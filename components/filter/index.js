export class FilterComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return `
            <div class="d-flex gap-2 mb-4">
                <input
                    type="text"
                    id="filter-input"
                    class="form-control"
                    placeholder="Поиск по названию..."
                    style="
                        background: rgba(255,255,255,0.15);
                        border: 1px solid rgba(255,255,255,0.3);
                        border-radius: 16px;
                        color: white;
                        padding: 10px 16px;
                    "
                />
                <button id="filter-btn" class="btn" style="
                    background: #7545E0;
                    border: none;
                    border-radius: 16px;
                    color: white;
                    padding: 10px 24px;
                    white-space: nowrap;
                ">Найти</button>
                <button id="filter-reset-btn" class="btn" style="
                    background: rgba(255,255,255,0.15);
                    border: 1px solid rgba(255,255,255,0.3);
                    border-radius: 16px;
                    color: white;
                    padding: 10px 20px;
                    white-space: nowrap;
                ">Сбросить</button>
            </div>
        `;
    }

    addListeners(onFilter) {
        const btn = document.getElementById('filter-btn');
        const resetBtn = document.getElementById('filter-reset-btn');
        const input = document.getElementById('filter-input');

        btn.addEventListener('click', () => {
            onFilter(input.value.trim());
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                onFilter(input.value.trim());
            }
        });

        resetBtn.addEventListener('click', () => {
            input.value = '';
            onFilter('');
        });
    }

    render(onFilter) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        this.addListeners(onFilter);
    }
}
