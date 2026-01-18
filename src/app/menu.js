
class MenuManager {
    constructor() {
        this.toggleBtn = document.getElementById('menu-toggle');
        this.nav = document.getElementById('nav');
    }

    init() {
        this.bindToggleBtnListener();
    }

    bindToggleBtnListener() {
        this.toggleBtn.addEventListener('click', () => {
            this.toggleBtn.classList.toggle('active');
            this.nav.classList.toggle('active');
        })
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const menuManager = new MenuManager();
    menuManager.init();
})