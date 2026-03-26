export class CartDataManager {
    constructor() {
        this.products = new Map();
        this.cart = document.querySelector('.cart__window');
        this.productsList = null;

        this.loadFromLocalStorage();
        this.init();
        this.bindEvents();
    }

    loadFromLocalStorage = () => {
        const saved = localStorage.getItem('products');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                parsed.forEach(product => {
                    this.products.set(product.id, product);
                });
            }
        }
    }

    saveToLocalStorage = () => {
        const productsArray = Array.from(this.products.values());
        localStorage.setItem('products', JSON.stringify(productsArray));
    }

    init = () => {
        if (!this.cart.querySelector('.cart__line')) {
            this.toggleCart(this.products.size > 0);
        }
        this.productsList = this.cart.querySelector('.cart__line');

        this.products.forEach(product => this.renderProduct(product));
        this.calculatingCartPrice();
    }

    bindEvents = () => {
        document.addEventListener('click', this.handleProductCounter);
        document.addEventListener('click', this.handleAddToCart);
        document.addEventListener('click', this.handleRemoveFromCart);
    }

    handleProductCounter = (e) => {
        if (!e.target.matches('.plus, .minus')) return;
        if (!this.cart || !this.cart.contains(e.target)) return;

        const parent = e.target.closest('.cart__data-cnt');
        const cnt = parent.querySelector('.cart__data-text');
        const productElement = e.target.closest('.cart__data');
        console.log(productElement)
        const id = productElement.getAttribute('id');
        const product = this.products.get(id);

        if (!product) return;

        if (e.target.matches('.plus')) {
            product.count = (product.count || 1) + 1;
            cnt.textContent = product.count;
            parent.querySelector('.minus').removeAttribute('disabled');
        } else {
            product.count = (product.count || 1) - 1;
            cnt.textContent = product.count;
            if (product.count === 1) e.target.setAttribute('disabled', true);
        }

        this.products.set(id, product);
        this.saveToLocalStorage();
        this.calculatingProductPrice(productElement);
        this.calculatingCartPrice();
    }

    handleAddToCart = (e) => {
        if (!e.target.matches('.coffee__button-active')) return;

        const productsBox = e.target.closest('.coffee__line');
        if (!productsBox) return;

        const productElement = e.target.closest('.coffee__card');
        if (!productElement) return;

        const id = productElement.getAttribute('id');
        if (!id) return;

        if (!this.productsList || !this.cart.querySelector('.cart__line')) {
            this.toggleCart(true);
            this.productsList = this.cart.querySelector('.cart__line');
        }

        if (this.products.has(id)) {
            const existing = this.products.get(id);
            existing.count = (existing.count || 1) + 1;
            this.products.set(id, existing);

            console.log(this.products.get(id))

            const cartItem = this.productsList.querySelector(`#${CSS.escape(id)}`);
            if (cartItem) {
                const cnt = cartItem.querySelector('.cart__data-text');
                if (cnt) cnt.textContent = existing.count;
                const minusBtn = cartItem.querySelector('.minus');
                if (minusBtn && existing.count > 1) minusBtn.removeAttribute('disabled');
                this.calculatingProductPrice(cartItem);
            }
        } else {
            const product = this.extractProductData(productElement);
            product.count = 1;
            this.products.set(id, product);
            this.renderProduct(product);
        }

        this.saveToLocalStorage();
        this.calculatingCartPrice();
    }

    handleRemoveFromCart = (e) => {
        if (!e.target.matches('.close-btn-data')) return;
        if (!this.productsList) return;

        const productElement = e.target.closest('.cart__data');
        const id = productElement.getAttribute('id');

        this.products.delete(id);

        productElement.remove();

        this.saveToLocalStorage();

        if (this.products.size === 0) {
            this.toggleCart(false);
            this.productsList = null;
        } else {
            this.calculatingCartPrice();
        }
    }

    extractProductData = (productElement) => {
        const name = productElement.querySelector('h3');
        const salePrice = productElement.querySelector('.sale__price');
        const price = productElement.querySelector('.coffee__price');
        const image = productElement.querySelector('.animation');

        return {
            id: productElement.getAttribute('id'),
            fixPrice: productElement.dataset.price || '',
            fixSalePrice: productElement.dataset.sale || '',
            name: name?.textContent || '',
            imgSrc: image?.getAttribute('src') || '',
            salePrice: salePrice?.textContent || '',
            price: price?.textContent || ''
        };
    }

    renderProduct = (product) => {
        if (!this.productsList) return;

        const newProductInCart = document.createElement('article');
        newProductInCart.className = 'coffee__card cart__data';
        newProductInCart.setAttribute('id', product.id);
        newProductInCart.setAttribute('data-price', product.fixPrice);
        newProductInCart.setAttribute('data-sale', product.fixSalePrice || '');
        newProductInCart.setAttribute('data-count', product.count || 1);

        newProductInCart.innerHTML = `
            <div class="coffee__container coffee__container-vert">
                <img class="animation" src="${product.imgSrc}" alt="Упаковка кофе"/>
            </div>
            <div class="coffee__content coffee__content-vert cart__data-content">
                <div class="cart__header cart__data-header">
                    <h3>${product.name}</h3>
                    <button class="close-btn close-btn-data"></button>
                </div>
                <div class="cart__data-main">
                    <div class="cart__data-cnt">
                        <button class="coffee__button coffee__button-active minus" ${product.count === 1 ? 'disabled' : ''}>-</button>
                        <p class="cart__data-text">${product.count || 1}</p>
                        <button class="coffee__button coffee__button-active plus">+</button>
                    </div>
                    <div class="coffee__actions">
                        <h4 class="coffee__price">${product.price}</h4>
                        <p class="sale__price"><s>${product.salePrice}</s></p>
                    </div>
                </div>
            </div>
        `;

        this.productsList.appendChild(newProductInCart);
    }

    toggleCart = (isProductsInCart) => {
        this.cart.innerHTML = isProductsInCart ? `
            <div class="cart__header">
                <h2>Ваш заказ</h2>
                <button class="close-btn"></button>
            </div>
            <div class="cart__line"></div>
            <div class="cart__price">
                <h3>Итого:</h3>
                <h3 id="full-price">0</h3>
            </div>
            <button class="coffee__button coffee__button-active cart__button">Оформить заказ</button>
        ` : `
            <button class="close-btn close-btn-preview"></button>
            <div class="cart__preview"><h2>Ваша корзина пуста</h2></div>
        `;
        this.productsList = this.cart.querySelector('.cart__line');
    }

    calculatingCartPrice = () => {
        if (!this.cart) return;

        const prices = this.cart.querySelectorAll('.coffee__price');
        let fullPrice = 0;

        prices.forEach(price => {
            if (price && price.textContent) {
                const value = parseInt(price.textContent.replace(/\s/g, '').split('.').join(''));
                if (!isNaN(value)) fullPrice += value;
            }
        });

        const priceElement = document.getElementById('full-price');
        if (priceElement) {
            priceElement.textContent = new Intl.NumberFormat('de-DE').format(fullPrice);
        }
    }

    calculatingProductPrice = (productElement) => {
        const cnt = productElement.querySelector('.cart__data-text');
        const count = parseInt(cnt.textContent);
        const fixPrice = productElement.dataset.price;
        const fixSalePrice = productElement.dataset.sale;
        const price = productElement.querySelector('.coffee__price');
        const salePrice = productElement.querySelector('.sale__price');

        if (price) {
            const formattingFullPrice = new Intl.NumberFormat('de-DE').format(parseInt(fixPrice) * count);
            price.textContent = `${formattingFullPrice}`;
        }
        if (salePrice) {
            const formattingSalePrice = new Intl.NumberFormat('de-DE').format(parseInt(fixSalePrice) * count);
            salePrice.innerHTML = `<s>${formattingSalePrice}</s>`;
        }
    }
}
