// ===== Mobile Menu Toggle =====
const btnMobile = document.getElementById('btn-mobile');
const nav = document.getElementById('nav');

function toggleMenu() {
    nav.classList.toggle('active');
    const expanded = btnMobile.getAttribute('aria-expanded') === 'true';
    btnMobile.setAttribute('aria-expanded', !expanded);
}

btnMobile.addEventListener('click', toggleMenu);

// Close menu when clicking a link
document.querySelectorAll('#nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        btnMobile.setAttribute('aria-expanded', 'false');
    });
});

// ===== Header Shadow on Scroll =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        header.style.boxShadow = '0 2px 20px rgba(12, 24, 57, 0.12)';
    } else {
        header.style.boxShadow = '0 2px 8px rgba(12, 24, 57, 0.08)';
    }
});

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add fade-in class to elements
document.querySelectorAll('.section-header, .sintoma-item, .sintomas-alert, .especialidade-card, .equipe-card, .depoimento-card, .unidade-card, .footer-col').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 70;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Generic Carousel =====
function initCarousel(config) {
    const container = document.querySelector(config.containerSelector);
    if (!container) return;

    const track = container.querySelector(config.trackSelector);
    const cards = container.querySelectorAll(config.cardSelector);
    const prevBtn = container.querySelector(config.prevBtnSelector);
    const nextBtn = container.querySelector(config.nextBtnSelector);
    const dotsContainer = document.querySelector(config.dotsContainerSelector);

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    let autoplayInterval = null;

    // Create dots
    if (dotsContainer) {
        cards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add(config.dotClass);
            dot.setAttribute('aria-label', `${config.ariaLabelPrefix} ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    const dots = dotsContainer ? dotsContainer.querySelectorAll(`.${config.dotClass}`) : [];

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        if (currentIndex < 0) currentIndex = cards.length - 1;
        if (currentIndex >= cards.length) currentIndex = 0;
        updateCarousel();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Auto-play
    if (config.autoplayDelay > 0) {
        autoplayInterval = setInterval(nextSlide, config.autoplayDelay);

        // Pause on hover
        container.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
        container.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(nextSlide, config.autoplayDelay);
        });
    }

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            nextSlide();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            prevSlide();
        }
    }
}

function initAllCarousels() {
    // Testimonials carousel
    initCarousel({
        containerSelector: '.depoimentos-carousel',
        trackSelector: '.carousel-track',
        cardSelector: '.depoimento-card',
        prevBtnSelector: '.carousel-prev',
        nextBtnSelector: '.carousel-next',
        dotsContainerSelector: '.carousel-dots',
        dotClass: 'carousel-dot',
        ariaLabelPrefix: 'Ir para depoimento',
        autoplayDelay: 6000
    });

    // Team carousel
    initCarousel({
        containerSelector: '.equipe-carousel',
        trackSelector: '.equipe-track',
        cardSelector: '.equipe-card',
        prevBtnSelector: '.equipe-prev',
        nextBtnSelector: '.equipe-next',
        dotsContainerSelector: '.equipe-dots',
        dotClass: 'equipe-dot',
        ariaLabelPrefix: 'Ir para especialista',
        autoplayDelay: 8000
    });
}

document.addEventListener('DOMContentLoaded', initAllCarousels);
