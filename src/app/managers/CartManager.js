export class CartManager {
    constructor() {
        this.modelWindow = document.createElement('aside');
        this.modelWindow.innerHTML = `
            <button class="close-btn close-btn-preview"></button>
            <div class="cart__preview"><h2>Ваша корзина пуста</h2></div>
        `;
        this.modelWindow.className = 'cart__window';

        this.cartOverlay = document.createElement('div');
        this.cartOverlay.className = 'cart__overlay';

        this.cart = document.getElementById('cart');

        this.#createCartModelWindow();
        this.#bindCartBtnListener();
    }

    #createCartModelWindow = () => {
        document.body.appendChild(this.modelWindow);
        document.body.appendChild(this.cartOverlay);

        this.cartOverlay.addEventListener('click', this.#toggleCartModelWindow);

        window.addEventListener('keydown', (e) => {
            if (e.key = 'Escape' && this.modelWindow.classList.contains('active')) {
                this.#toggleCartModelWindow();
            }
        })

        this.modelWindow.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-btn')) {
                this.#toggleCartModelWindow();
            }
        });
    }

    #toggleCartModelWindow = () => {
        console.log(this.modelWindow)
        this.modelWindow.classList.toggle('active');
        this.cartOverlay.classList.toggle('active');

        document.body.style.overflow = this.modelWindow.classList.contains('active') ? 'hidden' : '';
    }

    #bindCartBtnListener = () => {
        this.cart.addEventListener('click', this.#toggleCartModelWindow);
    }
}
