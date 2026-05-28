import{B as r}from"./index-CAnpL1x1.js";import{a as i,s as c,M as d}from"./index-rOtaDhfA.js";class l{constructor(t){this.parent=t}getHTML(t){return`
            <div class="card" style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); border-radius: 24px; color: white;">
                <div class="row g-0 align-items-center">
                    <div class="col-md-4 text-center p-3">
                        <img src="${t.src}" class="img-fluid" alt="иконка продукта" style="max-height: 120px; object-fit: contain;">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title" style="color: white;">${t.title}</h5>
                            <p class="card-text" style="color: rgba(255,255,255,0.7);">${t.text}</p>
                            <p class="card-text"><small style="color: rgba(255,255,255,0.5);">ID продукта: ${t.id}</small></p>
                        </div>
                    </div>
                </div>
            </div>
        `}render(t){const e=this.getHTML(t);this.parent.insertAdjacentHTML("beforeend",e)}}class p{constructor(t){this.parent=t,this.toastId="liveToast",this.renderToastContainer()}renderToastContainer(){const t=`
            <div class="toast-container position-fixed bottom-0 end-0 p-3">
                <div id="${this.toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true"
                     data-bs-autohide="true" data-bs-delay="3000" style="background: #7545E0; color: white;">
                    <div class="toast-header" style="background: rgba(255,255,255,0.2); color: white;">
                        <strong class="me-auto">Банк Точка</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Закрыть">всампирто</button>
                    </div>
                    <div class="toast-body">
                        Сообщение по умолчанию
                    </div>
                </div>
            </div>
        `;this.parent.insertAdjacentHTML("beforeend",t)}show(t){const e=document.getElementById(this.toastId);if(!e){console.error("Toast element not found");return}const s=e.querySelector(".toast-body");s&&(s.textContent=t),new bootstrap.Toast(e).show()}}class h{constructor(t,e){this.parent=t,this.id=e}get pageRoot(){return document.getElementById("product-page")}getHTML(){return`
            <div id="product-page" class="container py-4">
                <div id="product-loading" style="color: rgba(255,255,255,0.6); text-align:center; margin-top:40px;">
                    Загрузка...
                </div>
            </div>
        `}async getData(){try{const t=await i.get(c.getStockById(this.id)),e=document.getElementById("product-loading");e&&(e.style.display="none"),this.renderData(t)}catch(t){console.error("Ошибка получения карточки:",t);const e=document.getElementById("product-loading");e&&(e.textContent="Карточка не найдена")}}renderData(t){const e=document.createElement("div");e.className="row justify-content-center",this.pageRoot.appendChild(e);const s=document.createElement("div");s.className="col-md-6",e.appendChild(s),new l(s).render(t);const n=new p(this.pageRoot);setTimeout(()=>{n.show(`Вы просматриваете: ${t.title}`)},100)}clickBack(){new d(this.parent).render()}render(){this.parent.innerHTML="",this.parent.insertAdjacentHTML("beforeend",`
            <div class="marquee-container">
                <div class="marquee-content">
                    <span>🏦 Курс USD: 92.50 ₽ | EUR: 100.20 ₽ | CNY: 12.80 ₽ &nbsp;&nbsp;&nbsp;⭐</span>
                    <span>🔔 Кредитная карта «120 дней» — оформите онлайн!</span>
                    <span>💳 Дебетовая карта «Мир» — кэшбэк до 5%</span>
                    <span>📈 Накопительный счёт — до 8% на остаток</span>
                    <span>✨ Бесплатное обслуживание при выполнении условий</span>
                </div>
            </div>
        `),this.parent.insertAdjacentHTML("beforeend",this.getHTML()),new r(this.pageRoot).render(this.clickBack.bind(this)),this.getData()}}export{h as ProductPage};
