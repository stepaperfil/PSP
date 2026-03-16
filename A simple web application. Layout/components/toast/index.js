export class ToastComponent {
    constructor(parent) {
        this.parent = parent;
        this.toastId = 'liveToast';
        this.renderToastContainer();
    }

    renderToastContainer() {
        const containerHtml = `
            <div class="toast-container position-fixed bottom-0 end-0 p-3">
                <div id="${this.toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true"
                     data-bs-autohide="true" data-bs-delay="3000" style="background: #7545E0; color: white;">
                    <div class="toast-header" style="background: rgba(255,255,255,0.2); color: white;">
                        <strong class="me-auto">Банк Точка</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Закрыть"></button>
                    </div>
                    <div class="toast-body">
                        Сообщение по умолчанию
                    </div>
                </div>
            </div>
        `;
        this.parent.insertAdjacentHTML('beforeend', containerHtml);
    }

    show(message) {
        const toastEl = document.getElementById(this.toastId);
        if (!toastEl) {
            console.error('Toast element not found');
            return;
        }
        const toastBody = toastEl.querySelector('.toast-body');
        if (toastBody) toastBody.textContent = message;
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }
}
