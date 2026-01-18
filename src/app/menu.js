
class MenuManager {
    constructor() {
        this.menuToggle = document.getElementById('menu-toggle');
        this.mainNav = document.getElementById('nav');
        this.scrollBtn = document.getElementById('scrollTop');

        this.navOverlay = document.createElement('div');
        this.navOverlay.className = 'nav-overlay';
        document.body.appendChild(this.navOverlay);

        this.navLinks = document.querySelectorAll('.nav__link');
        this.toggleMenu = this.toggleMenu.bind(this);
    }

    init() {
        this.bindToggleMenuListeners();
        this.bindScrollTopListener();
    }

    toggleMenu() {
        const isExpanded = this.menuToggle.getAttribute('aria-expanded') === true;

        this.menuToggle.classList.toggle('active');
        this.menuToggle.setAttribute('aria-expanded', !isExpanded);
        this.navOverlay.classList.toggle('active');
        this.mainNav.classList.toggle('active');

        document.body.style.overflow = this.mainNav.classList.contains('active') ? 'hidden' : '';
    }

    bindToggleMenuListeners() {
        this.menuToggle.addEventListener('click', this.toggleMenu);
        this.navOverlay.addEventListener('click', this.toggleMenu);

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.mainNav.classList.contains('active')) {
                this.toggleMenu();
            }
        })

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mainNav.classList.contains('active')) {
                this.toggleMenu();
            }
        })

        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    this.toggleMenu();
                }
            })
        })
    }

    bindScrollTopListener() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                this.scrollBtn.classList.add('visible');
            } else {
                this.scrollBtn.classList.remove('visible');
            }
        })

        this.scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        })
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const menuManager = new MenuManager();
    menuManager.init();
})