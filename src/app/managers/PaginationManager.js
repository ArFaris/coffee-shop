export class PaginationManager {
    constructor() {
        this.listOfProducts = document.querySelectorAll('.coffee__card-vert');
        this.numberOfProducts = 3;
        this.numberOfPages = Math.ceil(this.listOfProducts.length / this.numberOfProducts);

        this.hiddenProducts();
        
        this.section = document.getElementById('coffee-line-vert');
        this.leftBtn = this.#createButton('←');
        this.rightBtn = this.#createButton('→');
        this.paginationLine = this.#createPaginationLine();

        this.init();
    }

    init() {
        this.togglePage(1, false);
    }

    #createButton(textContent) {
        const button = document.createElement('button');
        button.className = 'coffee__button coffee__button-active pagination__btn';
        button.textContent = textContent;

        return button;
    }

    #createPaginationLine() {
        this.paginationLine = document.createElement('div');
        this.paginationLine.className = 'pagination';

        this.paginationLine.appendChild(this.leftBtn);
        this.section.appendChild(this.paginationLine);

        this.#createPaginationButtons();
    }

    #createPaginationButtons() {
        for (let i = 1; i <= this.numberOfPages; i++) {
            const paginationBtn = this.#createButton(i.toString());
            if (i === 1) paginationBtn.classList.add('active');

            this.paginationLine.appendChild(paginationBtn);

            paginationBtn.addEventListener('click', () => {
                const currentBtn = document.querySelector('.pagination__btn.active');
                this.togglePage(currentBtn.textContent, true);
                currentBtn.classList.remove('active');

                paginationBtn.classList.add('active');
                this.togglePage(paginationBtn.textContent, false);
            })
        }

        this.paginationLine.appendChild(this.rightBtn);

        this.leftBtn.addEventListener('click', () => this.handlePaginationBtn(-1));
        this.rightBtn.addEventListener('click', () => this.handlePaginationBtn(1));
    }

    handlePaginationBtn(cnt) {
        const currentPage = document.querySelector('.pagination__btn.active');
        const numberOfPage = parseInt(currentPage.textContent);

        if (numberOfPage + cnt > this.numberOfPages || numberOfPage + cnt === 0) return;

        this.togglePage(numberOfPage, true);
        currentPage.classList.remove('active');

        this.togglePage(numberOfPage + cnt, false);
        const pageBtnActive = cnt === -1 ? currentPage.previousElementSibling : currentPage.nextElementSibling;
        pageBtnActive.classList.add('active');
    }

    togglePage(page, hidden) {
        const start = page * this.numberOfProducts - this.numberOfProducts;
        const arrayProducts = [...this.listOfProducts];
        const visibleProducts = arrayProducts.slice(start, start + this.numberOfProducts);
        console.log('МАССИВ ПРОДУКТОВ')
        console.log(arrayProducts);
        visibleProducts.forEach(product => product.style.display = hidden ? 'none' : 'flex');
    }

    hiddenProducts() {
        this.listOfProducts.forEach(product => product.style.display = 'none');
    }
}
