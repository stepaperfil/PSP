export class ProductComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="card" style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); border-radius: 24px; color: white;">
                <div class="row g-0 align-items-center">
                    <div class="col-md-4 text-center p-3">
                        <img src="${data.src}" class="img-fluid" alt="иконка продукта" style="max-height: 120px; object-fit: contain;">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title" style="color: white;">${data.title}</h5>
                            <p class="card-text" style="color: rgba(255,255,255,0.7);">${data.text}</p>
                            <p class="card-text"><small style="color: rgba(255,255,255,0.5);">ID продукта: ${data.id}</small></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
    }
}
