class StockUrls {
    constructor() {
        // В лабе 6 фронт раздаётся с того же сервера, поэтому baseUrl пустой —
        // запросы идут на тот же домен и порт, CORS не нужен
        this.baseUrl = '';
    }

    getStocks(title) {
        if (title) {
            return `${this.baseUrl}/stocks?title=${encodeURIComponent(title)}`;
        }
        return `${this.baseUrl}/stocks`;
    }

    getStockById(id) {
        return `${this.baseUrl}/stocks/${id}`;
    }

    createStock() {
        return `${this.baseUrl}/stocks`;
    }

    updateStockById(id) {
        return `${this.baseUrl}/stocks/${id}`;
    }

    removeStockById(id) {
        return `${this.baseUrl}/stocks/${id}`;
    }
}

export const stockUrls = new StockUrls();
