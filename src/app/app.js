import { MenuManager } from "./managers/MenuManager.js";
import { PaginationManager } from "./managers/PaginationManager.js";
import { CartManager } from "./managers/CartManager.js";
import { CartDataManager } from './managers/CartDataManager.js';

export default class coffeeApp {
    constructor() {
        this.menuManager = new MenuManager();
        this.paginationManager = new PaginationManager();
        this.cartManager = new CartManager();
        this.CartDataManager = new CartDataManager();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new coffeeApp();
})
