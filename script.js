// ==================== DOM Elements ====================
const loader = document.querySelector('.loader-container');
const percentBar = document.querySelector('.percent-bar');

// ==================== General Variables ====================
window.projectsLimit = 3;
window.currentCategory = 'all';

// Global function to show more projects
window.showMoreProjects = function () {
    window.projectsLimit = 999;
    window.filterProjects(window.currentCategory);
};

// Global function to filter projects
window.filterProjects = function (category) {
    window.currentCategory = category || 'all';
    const cards = document.querySelectorAll('.project-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const cardCategory = card.dataset.category || 'web';
        const matchesCategory = (window.currentCategory === 'all' || cardCategory === window.currentCategory);

        if (matchesCategory) {
            if (visibleCount < window.projectsLimit) {
                card.style.display = 'block';
                card.classList.add('visible');
                if (typeof gsap !== 'undefined') {
                    gsap.to(card, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.5,
                        overwrite: true,
                        ease: 'power2.out'
                    });
                }
                visibleCount++;
            } else {
                card.classList.remove('visible');
                card.style.display = 'none';
                if (typeof gsap !== 'undefined') gsap.set(card, { opacity: 0, y: 30, scale: 0.95 });
            }
        } else {
            card.classList.remove('visible');
            card.style.display = 'none';
            if (typeof gsap !== 'undefined') gsap.set(card, { opacity: 0, y: 30, scale: 0.95 });
        }
    });

    const viewMoreBtn = document.getElementById('view-more-projects');
    const ctaContainer = document.getElementById('projects-cta-container');
    if (viewMoreBtn && ctaContainer) {
        const totalMatching = Array.from(cards).filter(c =>
            window.currentCategory === 'all' || (c.dataset.category || 'web') === window.currentCategory
        ).length;

        if (visibleCount < totalMatching) {
            ctaContainer.style.display = 'block';
        } else {
            ctaContainer.style.display = 'none';
        }
    }
};

// ==================== Loader Animation ====================
const startLoading = () => {
    let loadingProgress = 0;
    const interval = setInterval(() => {
        loadingProgress += Math.floor(Math.random() * 10) + 15;
        if (loadingProgress > 100) loadingProgress = 100;

        if (percentBar) {
            percentBar.style.width = `${loadingProgress}%`;
        }

        if (loadingProgress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                if (loader) {
                    loader.classList.add('hidden');
                    loader.style.opacity = '0';
                    loader.style.visibility = 'hidden';
                    loader.style.pointerEvents = 'none';
                }

                if (typeof gsap !== 'undefined') {
                    gsap.to('body', {
                        opacity: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                } else {
                    document.body.style.opacity = '1';
                }

                initAnimations();
            }, 100);
        }
    }, 20);

    // Safety fallback: force remove loader after 5 seconds max
    setTimeout(() => {
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            loader.style.pointerEvents = 'none';
            document.body.style.opacity = '1';
        }
    }, 5000);
};

// ==================== Theme ====================
const checkTheme = () => {
    localStorage.setItem('theme', 'dark');
    document.body.classList.add('dark-mode');
};

// ==================== Scroll Observers ====================
const initScrollObserver = () => {
    // 1. Navigation background on scroll
    const nav = document.querySelector('nav');

    const topSentinel = document.createElement('div');
    topSentinel.style.position = 'absolute';
    topSentinel.style.top = '0';
    topSentinel.style.height = '50px';
    topSentinel.style.width = '100%';
    topSentinel.style.pointerEvents = 'none';
    topSentinel.style.visibility = 'hidden';
    document.body.prepend(topSentinel);

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }, { rootMargin: '0px', threshold: 0 });

    navObserver.observe(topSentinel);

    // 2. Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => sectionObserver.observe(section));
};

// ==================== Stats Counter Animation ====================
const animateStats = () => {
    document.querySelectorAll('.stat-number').forEach(stat => {
        const target = parseInt(stat.dataset.target, 10) || 0;
        let count = 0;
        const increment = target / 50;

        const updateCount = () => {
            if (count < target) {
                count += increment;
                stat.textContent = Math.ceil(count);
                setTimeout(updateCount, 30);
            } else {
                stat.textContent = target;
            }
        };

        updateCount();
    });
};

// ==================== GSAP Scroll Animations ====================
const initAnimations = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // About section animation
    if (document.querySelector('.about-text')) {
        gsap.from('.about-text', {
            scrollTrigger: {
                trigger: '.about-text',
                start: 'top bottom-=100',
                toggleActions: 'play none none none'
            },
            x: -100,
            opacity: 0,
            duration: 1
        });
    }

    if (document.querySelector('.about-image')) {
        gsap.from('.about-image', {
            scrollTrigger: {
                trigger: '.about-image',
                start: 'top bottom-=100',
                toggleActions: 'play none none none'
            },
            x: 100,
            opacity: 0,
            duration: 1
        });
    }

    // Stats animation
    if (document.querySelector('.stats-container')) {
        ScrollTrigger.create({
            trigger: '.stats-container',
            start: 'top bottom-=150',
            onEnter: () => animateStats()
        });
    }
};

// ==================== Skills 3D Particles ====================
const initSkills3D = () => {
    if (typeof THREE === 'undefined') return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const container = document.getElementById('skills-3d-space');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 400;

    const posArray = new Float32Array(particleCount * 3);
    const scaleArray = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        const radius = 25 + Math.random() * 15;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        posArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        posArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        posArray[i * 3 + 2] = radius * Math.cos(phi);

        scaleArray[i] = Math.random() * 1.5 + 0.5;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));

    const particlesMaterial = new THREE.ShaderMaterial({
        uniforms: {
            color1: { value: new THREE.Color(0x6c63ff) },
            color2: { value: new THREE.Color(0x00c9a7) },
            time: { value: 0 }
        },
        vertexShader: `
            attribute float scale;
            uniform float time;
            varying vec3 vColor;
            void main() {
                vec3 pos = position;
                pos.x += sin(pos.y * 0.05 + time) * 1.5;
                pos.y += cos(pos.x * 0.05 + time) * 1.5;
                pos.z += sin(pos.z * 0.05 + time) * 1.5;
                float colorMix = smoothstep(-20.0, 20.0, position.y);
                vColor = mix(vec3(0.424, 0.388, 1.0), vec3(0.0, 0.788, 0.655), colorMix);
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = scale * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            void main() {
                float distanceToCenter = length(gl_PointCoord - vec2(0.5));
                if (distanceToCenter > 0.5) discard;
                gl_FragColor = vec4(vColor, 0.7);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // Orbiting icons
    const iconGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const iconCount = 8;
    const icons = [];

    for (let i = 0; i < iconCount; i++) {
        const color = i % 2 === 0 ? 0x6c63ff : 0x00c9a7;
        const iconMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
        });

        const icon = new THREE.Mesh(iconGeometry, iconMaterial);

        const distance = 8 + Math.random() * 10;
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 20;

        icon.position.set(
            Math.cos(angle) * distance,
            height,
            Math.sin(angle) * distance
        );

        icon.userData = {
            orbitRadius: distance,
            orbitAngle: angle,
            orbitSpeed: 0.001 + Math.random() * 0.003
        };

        icons.push(icon);
        scene.add(icon);
    }

    // Pause rendering when the section is off-screen or the tab is hidden
    let isVisible = true;
    let rafId = null;
    let time = 0;

    const renderLoop = () => {
        rafId = null;
        if (!isVisible || document.hidden) return;

        time += 0.01;
        particlesMaterial.uniforms.time.value = time;
        particleSystem.rotation.y += 0.001;

        icons.forEach(icon => {
            icon.userData.orbitAngle += icon.userData.orbitSpeed;
            icon.position.x = Math.cos(icon.userData.orbitAngle) * icon.userData.orbitRadius;
            icon.position.z = Math.sin(icon.userData.orbitAngle) * icon.userData.orbitRadius;
        });

        renderer.render(scene, camera);
        rafId = requestAnimationFrame(renderLoop);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible && rafId === null && !document.hidden) {
                rafId = requestAnimationFrame(renderLoop);
            }
        });
    }, { threshold: 0 });
    observer.observe(container);

    const onVisibilityChange = () => {
        if (!document.hidden && isVisible && rafId === null) {
            rafId = requestAnimationFrame(renderLoop);
        }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    rafId = requestAnimationFrame(renderLoop);

    // Resize handling
    const handleResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Mouse parallax
    const handleMouseMove = (e) => {
        const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

        particleSystem.rotation.y = mouseX * 0.3;
        particleSystem.rotation.x = mouseY * 0.3;
    };
    window.addEventListener('mousemove', handleMouseMove);
};

// ==================== Smoke Cursor Effect (idle-paused) ====================
(function () {
    if (window.matchMedia('(max-width: 767px)').matches) return;

    const canvas = document.getElementById('cursor-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let mouseX = -100;
    let mouseY = -100;
    let lastX = -100;
    let lastY = -100;
    let particles = [];
    let rafId = null;

    // Pre-render the gradient particle
    const particleCanvas = document.createElement('canvas');
    const particleCtx = particleCanvas.getContext('2d');
    const particleSize = 64;
    particleCanvas.width = particleSize;
    particleCanvas.height = particleSize;

    const gradient = particleCtx.createRadialGradient(particleSize / 2, particleSize / 2, 0, particleSize / 2, particleSize / 2, particleSize / 2);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(0.6, 'rgba(180, 180, 180, 0.1)');
    gradient.addColorStop(1, 'rgba(150, 150, 150, 0)');

    particleCtx.fillStyle = gradient;
    particleCtx.beginPath();
    particleCtx.ellipse(particleSize / 2, particleSize / 2, particleSize / 2, particleSize / 2 * 0.8, 0, 0, Math.PI * 2);
    particleCtx.fill();

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    class Particle {
        constructor(x, y, vx, vy) {
            this.x = x + (Math.random() - 0.5) * 5;
            this.y = y + (Math.random() - 0.5) * 5;
            this.size = Math.random() * 15 + 8;
            this.speedX = vx * 0.2 + (Math.random() - 0.5) * 0.8;
            this.speedY = vy * 0.2 + (Math.random() - 0.5) * 0.8;
            this.opacity = Math.random() * 0.12 + 0.05;
            this.life = 1.0;
            this.decay = Math.random() * 0.06 + 0.05;
            this.growth = Math.random() * 0.5 + 0.3;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.size += this.growth;
            this.life -= this.decay;
            this.rotation += this.rotationSpeed;
        }

        draw() {
            if (this.life <= 0) return;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.life * this.opacity;
            ctx.drawImage(particleCanvas, -this.size, -this.size * 0.8, this.size * 2, this.size * 1.6);
            ctx.restore();
        }
    }

    // Only run the animation loop while particles exist (fully idle when still)
    function animate() {
        rafId = null;
        if (particles.length === 0) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'screen';

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.update();
            p.draw();
            if (p.life <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }

        if (particles.length > 0) {
            rafId = requestAnimationFrame(animate);
        }
    }

    // Rate-limit mouse events
    let lastEventTime = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastEventTime < 16) return;
        lastEventTime = now;

        mouseX = e.clientX;
        mouseY = e.clientY;

        // Lazy-init last position so the first frame doesn't streak wildly
        if (lastX === -100 && lastY === -100) {
            lastX = mouseX;
            lastY = mouseY;
        }

        const vx = Math.max(-30, Math.min(30, mouseX - lastX));
        const vy = Math.max(-30, Math.min(30, mouseY - lastY));

        for (let i = 0; i < 2; i++) {
            particles.push(new Particle(mouseX, mouseY, vx, vy));
        }

        lastX = mouseX;
        lastY = mouseY;

        if (rafId === null) {
            rafId = requestAnimationFrame(animate);
        }
    }, { passive: true });
})();

// ==================== Spline 3D Model Positioning ====================
const isMobileView = () => window.innerWidth <= 767;
const isTabletView = () => window.innerWidth >= 768 && window.innerWidth <= 1024;

// Hide the Spline watermark (a few attempts - no infinite polling)
const removeSplineWatermark = () => {
    const selectors = [
        'spline-viewer a',
        'spline-viewer a[target="_blank"]',
        'spline-viewer div[class*="logo"]',
        'spline-viewer div[class*="watermark"]',
        'spline-viewer > div > div > a',
        'spline-viewer [data-name*="logo"]',
        'spline-viewer [data-name*="watermark"]',
        'spline-viewer > div > div:last-child'
    ];

    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.display = 'none';
            el.style.opacity = '0';
            el.style.visibility = 'hidden';
            el.style.pointerEvents = 'none';
            try {
                el.remove();
            } catch (e) {
                // ignore
            }
        });
    });
};

// Watermark blocker for mobile
const addWatermarkBlocker = () => {
    if (!isMobileView()) return;
    const container = document.getElementById('hero-3d-space');
    if (!container) return;

    if (!container.querySelector('.spline-watermark-blocker')) {
        const blocker = document.createElement('div');
        blocker.className = 'spline-watermark-blocker';
        container.appendChild(blocker);
    }
};

// Position the Spline model per breakpoint (consolidated from multiple scripts)
const positionSplineModel = () => {
    const splineViewer = document.querySelector('spline-viewer');
    if (!splineViewer) return;

    if (isMobileView()) {
        splineViewer.style.transform = 'translateX(-40%)';
        addWatermarkBlocker();
    } else if (isTabletView()) {
        applyTabletFix();
    } else {
        splineViewer.style.transform = 'translateX(30%)';
    }
};

// Tablet layout fix (hero grid flip + model scaling)
const applyTabletFix = () => {
    const heroSection = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content');
    const modelContainer = document.querySelector('.hero-3d-container');
    const splineViewer = document.querySelector('spline-viewer');

    if (!heroSection || !heroContent || !modelContainer) return;

    if (splineViewer) {
        splineViewer.style.transform = 'translateX(8%) scale(1.4)';
        splineViewer.style.width = '100%';
        splineViewer.style.height = '100%';
        splineViewer.style.opacity = '1';
        splineViewer.style.visibility = 'visible';
        splineViewer.style.display = 'block';
        splineViewer.style.background = 'transparent';
        splineViewer.style.boxShadow = 'none';
        splineViewer.setAttribute('loading', 'eager');
    }

    modelContainer.style.height = '550px';
    modelContainer.style.minHeight = '550px';
    modelContainer.style.maxHeight = '550px';
    modelContainer.style.background = 'transparent';
    modelContainer.style.boxShadow = 'none';

    heroSection.style.display = 'grid';
    heroSection.style.gridTemplateColumns = '1fr';
    heroSection.style.gridTemplateRows = 'auto auto';
    heroSection.style.padding = '120px 20px 80px 20px';
    heroSection.style.height = 'auto';
    heroSection.style.minHeight = '100vh';

    modelContainer.style.gridRow = '1';
    heroContent.style.gridRow = '2';

    heroContent.querySelectorAll('.hero-title, .animated-name-wrapper, .subtitle, .premium-description, .cta-buttons, .social-links').forEach(el => {
        if (!el) return;
        el.style.textAlign = 'center';
        el.style.justifyContent = 'center';
        el.style.marginLeft = 'auto';
        el.style.marginRight = 'auto';
        el.style.width = '100%';
    });

    // Tablet watermark blur blocker
    if (!modelContainer.querySelector('.tablet-watermark-blur')) {
        const blocker = document.createElement('div');
        blocker.className = 'tablet-watermark-blur';
        blocker.style.cssText = `
            position: absolute;
            bottom: 12px;
            right: 12px;
            width: 120px;
            height: 40px;
            background: rgba(0,0,0,1);
            z-index: 9999999;
            box-shadow: 0 0 40px 30px rgba(0,0,0,1);
            border-radius: 50%;
            filter: blur(12px);
            pointer-events: none;
        `;
        modelContainer.appendChild(blocker);
    }
};

// ==================== Init ====================
document.addEventListener('DOMContentLoaded', () => {
    // Loader
    startLoading();

    // Theme
    checkTheme();

    // Scroll observers
    initScrollObserver();

    // Projects
    window.filterProjects('all');

    // Skills 3D particles
    initSkills3D();

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            window.projectsLimit = 3;
            window.filterProjects(btn.dataset.filter);
        });
    });

    // View more button
    const viewMoreBtn = document.getElementById('view-more-projects');
    if (viewMoreBtn) {
        viewMoreBtn.onclick = (e) => {
            e.preventDefault();
            window.showMoreProjects();
        };
    }

    // Tablet text fixes
    if (isTabletView()) {
        // Fix the "with" text placement
        const firstP = document.querySelector('.premium-description p:first-child');
        const secondP = document.querySelector('.premium-description p.with-line');
        if (firstP && secondP) {
            const firstText = firstP.textContent.trim();
            const secondText = secondP.textContent.trim();
            const newSecondText = secondText.replace("with", "").trim();
            firstP.textContent = firstText + " with";
            secondP.textContent = newSecondText;
        }

        // Center about section for tablet
        const aboutText = document.querySelector('#about .about-text');
        if (aboutText) {
            aboutText.style.textAlign = 'center';
            aboutText.querySelectorAll('p').forEach(p => { p.style.textAlign = 'center'; });
            const stats = document.querySelector('#about .stats-container');
            if (stats) {
                stats.style.display = 'flex';
                stats.style.justifyContent = 'center';
                stats.style.margin = '2rem auto';
            }
            aboutText.querySelectorAll('.stat-item').forEach(item => { item.style.textAlign = 'center'; });
        }
    }

    // Spline positioning (retry as the viewer loads)
    positionSplineModel();
    setTimeout(positionSplineModel, 300);
    setTimeout(positionSplineModel, 1000);
    setTimeout(positionSplineModel, 3000);

    // Spline loader hide
    const splineViewer = document.querySelector('spline-viewer');
    const splineLoader = document.getElementById('spline-loader');
    if (splineViewer && splineLoader) {
        const hideLoader = () => {
            splineLoader.classList.add('hidden');
            setTimeout(() => { splineLoader.style.display = 'none'; }, 200);
        };
        splineViewer.addEventListener('load', hideLoader);
        setTimeout(hideLoader, 1500);
    }

    // Watermark removal attempts (one-shot, all breakpoints)
    setTimeout(removeSplineWatermark, 1000);
    setTimeout(removeSplineWatermark, 2500);
    setTimeout(removeSplineWatermark, 5000);

    // Debounced resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            positionSplineModel();
            removeSplineWatermark();
        }, 150);
    });

    // Typing animation completion
    setTimeout(() => {
        const nameElement = document.querySelector('.animated-name');
        if (nameElement) {
            nameElement.classList.add('completed');
        }
    }, 3000);

    // Current year
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});

// ==================== Toast Notifications ====================
const showToast = (type, title, message) => {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.setAttribute('aria-live', 'polite');
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'error' : 'success'}`;
    const icon = type === 'error' ? 'fa-times' : 'fa-check';
    toast.innerHTML = `
        <span class="toast-icon"><i class="fas ${icon}"></i></span>
        <div class="toast-body">
            <span class="toast-title">${title}</span>
            <span class="toast-message">${message}</span>
        </div>
        <button type="button" class="toast-close" aria-label="Close"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(toast);

    // Animate in on the next frame
    requestAnimationFrame(() => toast.classList.add('show'));

    // Auto-dismiss after 4s, manual close button too
    let dismissed = false;
    const dismiss = () => {
        if (dismissed) return;
        dismissed = true;
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 350);
    };
    toast.querySelector('.toast-close').addEventListener('click', dismiss);
    setTimeout(dismiss, 4000);
};

// ==================== Contact Form Submission (FormSubmit AJAX) ====================
// Emails are delivered to this address via FormSubmit (no backend needed).
// NOTE: The first submission triggers a one-time activation email from FormSubmit —
// click the link in it once so all future submissions land in the inbox.
const CONTACT_EMAIL = 'adityacodearena@gmail.com';

document.addEventListener('submit', function (e) {
    const form = e.target;
    if (!form.classList.contains('contact-form')) return;

    e.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) return;

    // Honeypot: bots fill hidden fields — silently drop spam
    const honey = form.querySelector('input[name="_honey"]');
    if (honey && honey.value.trim() !== '') return;

    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    // Build JSON payload from the form fields
    const formData = new FormData(form);
    const payload = {
        _subject: `Portfolio Contact: ${formData.get('name') || 'New Message'}`,
        _template: 'table',
        _captcha: 'false',
        _honey: ''
    };
    formData.forEach((value, key) => {
        if (key !== '_honey') payload[key] = value;
    });

    // Timeout guard so the button never gets stuck in "Sending..."
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
    })
        .then(response => response.json())
        .then(data => {
            if (data && (data.success === 'true' || data.success === true)) {
                form.reset();
                submitButton.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
                showToast('success', 'Message Sent', 'Thanks for reaching out — I\'ll get back to you within 1-2 business days.');
            } else {
                submitButton.innerHTML = '<i class="fas fa-times"></i> Failed - try again';
                showToast('error', 'Something Went Wrong', 'Please try again in a moment.');
            }
        })
        .catch(() => {
            submitButton.innerHTML = '<i class="fas fa-times"></i> Failed - try again';
            showToast('error', 'Something Went Wrong', 'Please check your connection and try again.');
        })
        .finally(() => {
            clearTimeout(timeoutId);
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }, 2500);
        });
});
