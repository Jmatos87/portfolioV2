// ─── Navigation: frosted glass on scroll ──────────────
function initNav() {
    const nav = document.getElementById('nav');
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:1px;height:1px;width:1px;pointer-events:none;';
    document.body.prepend(sentinel);

    const observer = new IntersectionObserver(
        ([entry]) => nav.classList.toggle('nav--scrolled', !entry.isIntersecting),
        { threshold: 1 }
    );
    observer.observe(sentinel);
}

// ─── Mobile nav toggle ────────────────────────────────
function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    if (!toggle || !links) return;

    function isMobile() { return window.innerWidth <= 768; }

    function closeNav() {
        links.classList.remove('nav-links--open');
        toggle.classList.remove('nav-toggle--active');
        toggle.setAttribute('aria-expanded', 'false');
        if (isMobile()) links.setAttribute('aria-hidden', 'true');
    }

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('nav-links--open');
        toggle.classList.toggle('nav-toggle--active', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        if (isMobile()) links.setAttribute('aria-hidden', String(!isOpen));
    });

    // Close on link click
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && links.classList.contains('nav-links--open')) {
            closeNav();
            toggle.focus();
        }
    });
}

// ─── Typewriter ───────────────────────────────────────
function initTypewriter() {
    const el = document.getElementById('hero-typewriter');
    if (!el) return;

    const phrases = [
        'full-stack engineer',
        'AI-augmented builder',
        'systems thinker',
        '9+ years in enterprise',
        'versatile across every layer',
    ];

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
        el.textContent = phrases[0];
        return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let erasing = false;
    let cursorVisible = true;

    const cursor = '|';
    setInterval(() => {
        cursorVisible = !cursorVisible;
        render();
    }, 530);

    function render() {
        el.textContent = phrases[phraseIndex].slice(0, charIndex) + (cursorVisible || charIndex === 0 ? cursor : ' ');
    }

    function tick() {
        if (!erasing) {
            charIndex++;
            render();
            if (charIndex === phrases[phraseIndex].length) {
                erasing = true;
                setTimeout(tick, 1500);
                return;
            }
            setTimeout(tick, 60);
        } else {
            charIndex--;
            render();
            if (charIndex === 0) {
                erasing = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(tick, 400);
                return;
            }
            setTimeout(tick, 30);
        }
    }

    tick();
}

// ─── Scroll fade-in ───────────────────────────────────
function initFadeIn() {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in--visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(el => observer.observe(el));
}

// ─── Gradient text follows mouse ──────────────────────
function initGradientMouse() {
    const el = document.querySelector('.gradient-text');
    if (!el) return;

    document.addEventListener('mousemove', (e) => {
        const x = 100 - (e.clientX / window.innerWidth) * 100;
        const y = 100 - (e.clientY / window.innerHeight) * 100;
        el.style.backgroundPosition = `${x}% ${y}%`;
    });
}

// ─── Dark mode toggle ─────────────────────────────────
function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    const icon = btn?.querySelector('i');
    if (!btn || !icon) return;

    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;

    function applyTheme(dark) {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        icon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    }

    applyTheme(isDark);

    btn.addEventListener('click', () => {
        const currentlyDark = document.documentElement.getAttribute('data-theme') === 'dark';
        applyTheme(!currentlyDark);
    });
}

// ─── Nav home link scrolls to top ─────────────────────
function initNavHome() {
    const home = document.getElementById('nav-home');
    if (!home) return;
    home.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ─── Init ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initMobileNav();
    initNavHome();
    initThemeToggle();
    initGradientMouse();
    initTypewriter();
    initFadeIn();
});
