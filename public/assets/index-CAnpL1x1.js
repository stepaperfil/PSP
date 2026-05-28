class r{constructor(t){this.parent=t}addListeners(t){document.getElementById("back-button").addEventListener("click",t)}getHTML(){return`
            <button id="back-button" class="btn btn-secondary"
                    style="background: #7545E0; border: none; border-radius: 16px; margin-bottom: 20px;">
                ← Назад
            </button>
        `}render(t){const e=this.getHTML();this.parent.insertAdjacentHTML("beforeend",e),this.addListeners(t)}}export{r as B};
