export class BackButtonComponent {
    constructor(parent) {
        this.parent = parent;
    }

    addListeners(listener) {
        document.getElementById("back-button").addEventListener("click", listener);
    }

    getHTML() {
        return `
            <button id="back-button" class="btn btn-secondary"
                    style="background: #7545E0; border: none; border-radius: 16px; margin-bottom: 20px;">
                ← Назад
            </button>
        `;
    }

    render(listener) {
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(listener);
    }
}
