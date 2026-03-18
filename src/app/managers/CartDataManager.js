export class CartDataManager {
    constructor() {
        this.cartData();
    }

    cartData = () => {
        const cart = document.querySelector('.cart__window');
        let productsList;

        console.log(productsList);
        const productCounter = () => {
            cart.addEventListener('click', (e) => {

                if (e.target.matches('.plus') || e.target.matches('.minus')) {
                    const parent = e.target.closest('.cart__data-cnt');
                    const cnt = parent.querySelector('.cart__data-text');

                    if (e.target.matches('.plus')) {
                        cnt.textContent = ++cnt.textContent;

                        parent.querySelector('.minus').removeAttribute('disabled');
                    } else {
                        cnt.textContent = --cnt.textContent;

                        if (cnt.textContent === '1') e.target.setAttribute('disabled', true);
                    }
                    const product = e.target.closest('.cart__data');
                    calculatingProductPrice(product);
                    calculatingCartPrice();
                }
            })
        }
        productCounter();

        const addProductInCart = () => {
            const productsBox = document.getElementById('coffee__line-vert');

            productsBox.addEventListener('click', (e) => {

                if (e.target.matches('.coffee__button-active')) {
                    if (!cart.querySelector('.cart__line')) {
                        toggleCart(true);
                    }

                    productsList = cart.querySelector('.cart__line');
                    removeCartProduct();
                    
                    const productElement = e.target.closest('.coffee__card');
                    const name = productElement.querySelector('h3');
                    const salePrice = productElement.querySelector('.sale__price');
                    const price = productElement.querySelector('.coffee__price');
                    const image = productElement.querySelector('.animation');

                    const product = {};

                    product.id = productElement.getAttribute('id');
                    product.fixPrice = productElement.dataset.price;
                    product.fixSalePrice = productElement.dataset.sale;
                    console.log('sale')
                    console.log(product.fixSalePrice);
                    product.name = name.textContent;
                    product.imgSrc = image.getAttribute('src');
                    product.salePrice = salePrice.textContent;
                    product.price = price.textContent;

                    console.log(product.id)
                    const productInCart = productsList.querySelector(`#${product.id}`);

                    if (productInCart) {
                        const cnt = productInCart.querySelector('.cart__data-text');
                        cnt.textContent = ++cnt.textContent;
                        productInCart.querySelector('.minus').removeAttribute('disabled');
                        calculatingProductPrice(productInCart);
                    } else {
                        renderProduct(product);
                    }
                    calculatingCartPrice();
                }
            })

            const renderProduct = (product) => {
                const newProductInCart = document.createElement('article');
                newProductInCart.className = 'coffee__card cart__data';
                newProductInCart.setAttribute('id', `${product.id}`);
                newProductInCart.setAttribute('data-price', `${product.fixPrice}`);
                newProductInCart.setAttribute('data-sale', `${product.fixSalePrice}`);
                console.log(newProductInCart.getAttribute('id'));

                newProductInCart.innerHTML = `
                    <div class="coffee__container coffee__container-vert">
                        <img class="animation" src=${product.imgSrc} alt="Упаковка кофе"/>
                    </div>

                    <div class="coffee__content coffee__content-vert cart__data-content">
                        <div class="cart__header cart__data-header">
                            <h3>${product.name}</h3>
                            <button class="close-btn close-btn-data"></button>
                        </div>

                        <div class="cart__data-main">
                            <div class="cart__data-cnt">
                                <button class="coffee__button coffee__button-active minus" disabled>-</button>
                                <p class="cart__data-text">1</p>
                                <button class="coffee__button coffee__button-active plus">+</button>
                            </div>

                            <div class="coffee__actions">
                                <h4 class="coffee__price">${product.price}</h4>
                                <p class="sale__price"><s>${product.salePrice}</s></p>
                            </div>
                        </div>
                    </div>
                `;

                productsList.appendChild(newProductInCart);
            }
        }
        addProductInCart();

        const removeCartProduct = () => {
            if (!productsList) return;

            productsList.addEventListener('click', (e) => {
                if (e.target.matches('.close-btn-data')) {
                    const product = e.target.closest('.cart__data');
                    console.log(product);
                    productsList.removeChild(product);

                    if (productsList.firstChild) {
                        calculatingCartPrice();
                    } else {
                        toggleCart(false);
                    }
                }
            })
        }

        const toggleCart = (isProductsInCart) => {
            cart.innerHTML = isProductsInCart ? `
                <div class="cart__header">
                    <h2>Ваш заказ</h2>
                    <button class="close-btn"></button>
                </div>

                <div class="cart__line"></div>
                    
                <div class="cart__price">
                    <h3>Итого:</h3>
                    <h3 id="full-price">14 000</h3>
                </div>

                <button class="coffee__button coffee__button-active cart__button">Оформить заказ</button>
            ` : `
                <button class="close-btn close-btn-preview"></button>
                <div class="cart__preview"><h2>Ваша корзина пуста</h2></div>
            `;
        }

        const calculatingCartPrice = () => {
            const prices = cart.querySelectorAll('.coffee__price');
            const salePrices = cart.querySelectorAll('.sale__price');

            let fullPrice = 0, salePrice = 0;
            prices.forEach(price => {
                console.log(price);
                fullPrice += parseInt(price.textContent.split('.').join(''));
                console.log(fullPrice);
                console.log(price.textContent.split('.').join(''));
            });
            salePrices.forEach(price => salePrice += parseInt(price.textContent.split('.').join('')));

            const formattingFullPrice = new Intl.NumberFormat('de-DE').format(fullPrice);
            const formattingSalePrice = new Intl.NumberFormat('de-DE').format(salePrice);
            
            const priceElement = document.getElementById('full-price');
            priceElement.textContent = `${formattingFullPrice}`;
        }

        const calculatingProductPrice = (product) => {
            const cnt = product.querySelector('.cart__data-text');
            const fixPrice = product.dataset.price;
            const fixSalePrice = product.dataset.sale;
            const price = product.querySelector('.coffee__price');
            const salePrice = product.querySelector('.sale__price');

            const formattingFullPrice = new Intl.NumberFormat('de-DE').format(parseInt(fixPrice) * parseInt(cnt.textContent));
            const formattingSalePrice = new Intl.NumberFormat('de-DE').format(parseInt(fixSalePrice) * parseInt(cnt.textContent));

            price.textContent = `${formattingFullPrice}`;
            salePrice.textContent = `${formattingSalePrice}`;
        }
    }
}
