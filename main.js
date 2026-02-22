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

// ─── Wireframe globe ──────────────────────────────────
function initGlobe() {
    const canvas = document.getElementById('globe-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const size = Math.min(window.innerHeight * 0.95, 800);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 2.8;

    // Sphere wireframe
    const geo = new THREE.SphereGeometry(1, 16, 16);
    const wireGeo = new THREE.WireframeGeometry(geo);
    const mat = new THREE.LineBasicMaterial({ color: 0x00b482, opacity: 0.35, transparent: true });
    const globe = new THREE.LineSegments(wireGeo, mat);
    scene.add(globe);

    // Subtle glow overlay — slightly larger solid sphere
    const glowGeo = new THREE.SphereGeometry(1.01, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x00bcd2, wireframe: false, transparent: true, opacity: 0.03 });
    scene.add(new THREE.Mesh(glowGeo, glowMat));

    // Mouse influence
    let targetX = 0, targetY = 0;
    document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 0.6;
        targetY = (e.clientY / window.innerHeight - 0.5) * 0.6;
    });

    // Resize
    window.addEventListener('resize', () => {
        const s = Math.min(window.innerHeight * 0.95, 800);
        renderer.setSize(s, s);
    });

    let autoY = 0;
    (function animate() {
        requestAnimationFrame(animate);
        autoY += 0.002;
        globe.rotation.y = autoY + targetX;
        globe.rotation.x += (targetY - globe.rotation.x) * 0.05;
        renderer.render(scene, camera);
    })();
}

// ─── Gradient text: idle animation + mouse follow ─────
function initGradientMouse() {
    const el = document.querySelector('.gradient-text');
    if (!el) return;

    let mouseX = 50, mouseY = 50;
    let currentX = 50, currentY = 50;
    let lastMouseMove = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = 100 - (e.clientX / window.innerWidth) * 100;
        mouseY = 100 - (e.clientY / window.innerHeight) * 100;
        lastMouseMove = Date.now();
    });

    function animate() {
        requestAnimationFrame(animate);

        const idleSeconds = (Date.now() - lastMouseMove) / 1000;
        const isIdle = idleSeconds > 1;

        let targetX, targetY;
        if (isIdle) {
            const t = Date.now() / 1000;
            targetX = 50 + Math.sin(t * 0.4) * 45;
            targetY = 50 + Math.cos(t * 0.3) * 45;
        } else {
            targetX = mouseX;
            targetY = mouseY;
        }

        const ease = isIdle ? 0.02 : 0.08;
        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;

        el.style.backgroundPosition = `${currentX}% ${currentY}%`;
    }

    animate();
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
    initGlobe();
    initGradientMouse();
    initTypewriter();
    initFadeIn();
});
