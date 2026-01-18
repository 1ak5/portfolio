// ==================== DOM Elements ====================
const loader = document.querySelector('.loader-container');
const percentBar = document.querySelector('.percent-bar');
const customCursor = document.querySelector('.custom-cursor');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.querySelector('.theme-toggle');
const allNavLinks = document.querySelectorAll('.nav-link');
const nav = document.querySelector('nav');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const statsNumbers = document.querySelectorAll('.stat-number');
const progressBars = document.querySelectorAll('.progress-bar');
const glitchText = document.querySelector('.glitch-text');

// ==================== General Variables ====================
let originalGlitchText = '';
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
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    overwrite: true,
                    ease: 'power2.out'
                });
                visibleCount++;
            } else {
                card.classList.remove('visible');
                card.style.display = 'none';
                gsap.set(card, { opacity: 0, y: 30, scale: 0.95 });
            }
        } else {
            card.classList.remove('visible');
            card.style.display = 'none';
            gsap.set(card, { opacity: 0, y: 30, scale: 0.95 });
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
                isLoaded = true;
                if (loader) {
                    loader.classList.add('hidden');
                    loader.style.opacity = '0';
                    loader.style.visibility = 'hidden';
                    loader.style.pointerEvents = 'none';
                }

                try {
                    if (typeof initAnimations === 'function') {
                        initAnimations();
                    } else {
                        console.warn("initAnimations function not found");
                    }

                    if (typeof gsap !== 'undefined') {
                        // Add reveal animation to body
                        gsap.to('body', {
                            opacity: 1,
                            duration: 0.3,
                            ease: 'power2.out'
                        });
                    } else {
                        document.body.style.opacity = '1';
                    }
                } catch (e) {
                    console.error("Error starting animations:", e);
                    document.body.style.opacity = '1';
                }
            }, 100);
        }
    }, 20);

    // Safety fallback: Force remove loader after 5 seconds max
    setTimeout(() => {
        if (loader && !loader.classList.contains('hidden')) {
            console.warn("Force removing loader due to timeout");
            loader.classList.add('hidden');
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            loader.style.pointerEvents = 'none';
            document.body.style.opacity = '1';
        }
    }, 5000);
};



// Separate render function for better performance
// renderCursor removed

// expandCursor removed

// shrinkCursor removed

// Simplified trail creation
// createCursorTrail removed

// Add pulsing animation to cursor
// startCursorPulse removed

// Add glitch effect to hero text
// startGlitchEffect removed (using newer version)

// Start the random glitching
// randomGlitch(); // Removed to avoid error if not defined


// ==================== Navigation ====================
const toggleMenu = () => {
    navLinks.classList.toggle('active');
    if (navLinks.classList.contains('active')) {
        navToggle.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
};

const closeMenu = () => {
    navLinks.classList.remove('active');
    navToggle.innerHTML = '<i class="fas fa-bars"></i>';
};

// toggleTheme function is kept for backward compatibility but won't be used
const toggleTheme = () => {
    // This function is kept for backward compatibility
    // But we're forcing dark mode
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
};

const checkTheme = () => {
    // Always use dark mode
    localStorage.setItem('theme', 'dark');
    // Add dark mode if it was not previously set
    document.body.classList.add('dark-mode');
};

// Scroll handling replaced by IntersectionObserver
const initScrollObserver = () => {
    // 1. Navigation Background on Scroll
    const nav = document.querySelector('nav');
    const heroSection = document.querySelector('.hero-section') || document.body;

    // Create a sentinel for the top of the page to toggle nav class
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

    // 2. Active Section Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Remove active from all
                navLinks.forEach(link => link.classList.remove('active'));
                // Add to current
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 }); // Trigger when section is in middle of viewport

    sections.forEach(section => sectionObserver.observe(section));
};

// Initialize observers on load
document.addEventListener('DOMContentLoaded', initScrollObserver);

// ==================== Projects Filter (Handled Globally at top) ====================

// ==================== Stats Counter Animation ====================
const animateStats = () => {
    statsNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.target);
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

// ==================== Progress Bars Animation ====================
const animateProgressBars = () => {
    progressBars.forEach(bar => {
        const percent = bar.dataset.percent;
        gsap.to(bar, {
            width: `${percent}%`,
            duration: 1.5,
            ease: 'power2.out'
        });
    });
};

// ==================== Testimonial Slider ====================



// ==================== GSAP Animations ====================
const initAnimations = () => {
    console.log("Initializing all animations...");

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Project cards reveal animation removed - handled in filterProjects for better control

    // Skills cards reveal animation
    gsap.utils.toArray('.skill-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.1
        });
    });

    // About section animation
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

    // Contact section animation - basic animations (keeping for backwards compatibility)
    gsap.from('.contact-info', {
        scrollTrigger: {
            trigger: '.contact-info',
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
        },
        x: -100,
        opacity: 0,
        duration: 1
    });

    gsap.from('.contact-form-container', {
        scrollTrigger: {
            trigger: '.contact-form-container',
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
        },
        x: 100,
        opacity: 0,
        duration: 1
    });

    // Stats animation
    ScrollTrigger.create({
        trigger: '.stats-container',
        start: 'top bottom-=150',
        onEnter: () => animateStats()
    });

    // Progress bars animation
    ScrollTrigger.create({
        trigger: '.skills-grid',
        start: 'top bottom-=150',
        onEnter: () => animateProgressBars()
    });

    // Explicitly call the contact animations
    console.log("About to initialize contact animations...");
    initContactAnimations();
};

// ==================== THREE.JS 3D ANIMATIONS ====================

// Hero Section 3D Animation
// initHero3D removed for performance (Spline used instead)


// Orphaned code removed


// Skills Section 3D Animation
const initSkills3D = () => {
    // Check for mobile device - disable 3D on mobile for performance
    if (window.matchMedia("(max-width: 768px)").matches) {
        return;
    }

    const container = document.getElementById('skills-3d-space');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 30;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
    container.appendChild(renderer.domElement);

    // Reduced particle count for performance
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 400; // Reduced from 700

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

    // Custom shader material
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

    // Optimized: Static icons without expensive lights
    const iconGeometry = new THREE.SphereGeometry(0.5, 16, 16); // Reduced segments
    const iconCount = 8; // Reduced count
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

        // Fake glow with sprite instead of PointLight
        // (Skipped for simplicity and performance)

        icon.userData = {
            orbitRadius: distance,
            orbitAngle: angle,
            orbitSpeed: 0.001 + Math.random() * 0.003
        };

        icons.push(icon);
        scene.add(icon);
    }

    // REMOVED: Expensive dynamic lines calculation

    // Visibility Check
    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
        });
    }, { threshold: 0 });
    observer.observe(container);

    // Animation
    let time = 0;
    const animate = () => {
        requestAnimationFrame(animate);

        if (!isVisible) return; // Skip rendering if not visible

        time += 0.01;
        particlesMaterial.uniforms.time.value = time;

        particleSystem.rotation.y += 0.001;

        icons.forEach(icon => {
            icon.userData.orbitAngle += icon.userData.orbitSpeed;
            icon.position.x = Math.cos(icon.userData.orbitAngle) * icon.userData.orbitRadius;
            icon.position.z = Math.sin(icon.userData.orbitAngle) * icon.userData.orbitRadius;
        });

        renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Handle mouse movement for interactive effect
    const handleMouseMove = (e) => {
        const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

        // Subtle rotation based on mouse position
        particleSystem.rotation.y = mouseX * 0.3;
        particleSystem.rotation.x = mouseY * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Clean up function
    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        container.removeChild(renderer.domElement);
    };
};

// Skills Progress Animation
const animateSkills = () => {
    const skillElements = document.querySelectorAll('.premium-skill-progress');

    skillElements.forEach(skill => {
        // Get the target width from inline style
        const targetWidth = skill.style.width;

        // Set all skills to consistent silver styling
        skill.style.background = "linear-gradient(90deg, rgba(192, 192, 200, 1), rgba(220, 220, 230, 1), rgba(192, 192, 200, 1), rgba(230, 230, 240, 1))";
        skill.style.backgroundSize = "200% 100%";
        skill.style.boxShadow = "0 0 8px rgba(192, 192, 200, 0.6)";

        // Force the width to match the percentage immediately
        skill.style.width = targetWidth;

        // Add animation manually
        skill.style.animation = "silverShine 2s infinite ease-in-out";
    });

    // Add floating skill elements to the 3D container
    addFloatingSkills();
};

// Add floating skill elements to the background
const addFloatingSkills = () => {
    const container = document.getElementById('skills-3d-space');
    if (!container) return;

    // Only add floating skills if they don't already exist
    if (container.querySelector('.floating-skill')) return;

    const skills = [
        'HTML5', 'CSS3', 'JavaScript', 'React',
        'Node.js', 'SASS', 'Git', 'UI/UX'
    ];

    const colors = [
        '#6c63ff', '#00c9a7', '#ff6b6b', '#feca57',
        '#1dd1a1', '#ff9ff3', '#54a0ff', '#5f27cd'
    ];

    // Create floating skill elements
    skills.forEach((skill, index) => {
        const element = document.createElement('div');
        element.className = 'floating-skill';
        element.textContent = skill;
        element.style.backgroundColor = colors[index % colors.length];

        // Random positioning
        const xPos = Math.random() * 100;
        const yPos = Math.random() * 100;
        const zPos = Math.random() * 50 - 25;
        const scale = 0.8 + Math.random() * 0.4;
        const rotation = Math.random() * 20 - 10;

        element.style.left = `${xPos}%`;
        element.style.top = `${yPos}%`;
        element.style.transform = `translateZ(${zPos}px) scale(${scale}) rotate(${rotation}deg)`;

        // Animation duration and delay
        const duration = 15 + Math.random() * 20;
        const delay = Math.random() * -20;

        element.style.animationDuration = `${duration}s`;
        element.style.animationDelay = `${delay}s`;

        container.appendChild(element);
    });
};

// Contact Section Animations
const initContactAnimations = () => {
    console.log("Contact animations initializing...");

    const contactInfo = document.querySelector('.contact-info');
    const contactForm = document.querySelector('.contact-form-container');
    const contactItems = document.querySelectorAll('.contact-item');
    const socialIcons = document.querySelectorAll('.contact-social .social-icon');

    // Set initial visibility for all elements
    if (contactInfo) contactInfo.style.opacity = "1";
    if (contactForm) contactForm.style.opacity = "1";
    contactItems.forEach(item => item.style.opacity = "1");
    socialIcons.forEach(icon => icon.style.opacity = "1");

    console.log("Contact elements found:", {
        "contactInfo": contactInfo ? "Found" : "Not found",
        "contactForm": contactForm ? "Found" : "Not found",
        "contactItems": contactItems.length,
        "socialIcons": socialIcons.length
    });

    // Only run GSAP animations if ScrollTrigger is available
    if (window.ScrollTrigger && gsap) {
        // Staggered animation for contact items
        gsap.from(contactItems, {
            scrollTrigger: {
                trigger: contactInfo,
                start: 'top bottom-=100',
                toggleActions: 'play none none none'
            },
            opacity: 0.5, // Start with partial opacity
            x: -50,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power2.out'
        });

        // Animation for contact form
        gsap.from(contactForm, {
            scrollTrigger: {
                trigger: contactForm,
                start: 'top bottom-=100',
                toggleActions: 'play none none none'
            },
            opacity: 0.5, // Start with partial opacity
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });

        // Staggered animation for social icons
        gsap.from(socialIcons, {
            scrollTrigger: {
                trigger: '.contact-social',
                start: 'top bottom-=50',
                toggleActions: 'play none none none'
            },
            opacity: 0.5, // Start with partial opacity
            y: 30,
            scale: 0.5,
            stagger: 0.1,
            duration: 0.6,
            ease: 'back.out(1.7)'
        });

        console.log("GSAP animations applied");
    } else {
        console.log("GSAP or ScrollTrigger not available, skipping animations");
    }

    // Form input focus effects
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

    formInputs.forEach(input => {
        // Add active class to parent when input is focused
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('input-active');
        });

        // Remove active class when input loses focus
        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                input.parentElement.classList.remove('input-active');
            }
        });

        // Check if input has value on page load
        if (input.value.trim() !== '') {
            input.parentElement.classList.add('input-active');
        }
    });

    // Add subtle parallax effect to contact info
    window.addEventListener('mousemove', e => {
        if (!contactInfo) return; // Skip if element not found

        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

        gsap.to(contactInfo, {
            x: moveX,
            y: moveY,
            duration: 1,
            ease: 'power1.out'
        });
    });
};

// Call this function after page load
window.addEventListener('load', () => {
    setTimeout(fixContactSectionVisibility, 1000);
    setTimeout(fixContactSectionVisibility, 3000); // Try again after 3 seconds
});

// ==================== Event Listeners ====================
document.addEventListener('DOMContentLoaded', () => {
    // Start loader
    startLoading();
    // checkTheme(); // Removed

    // Check theme
    checkTheme();

    // Initialize 3D scenes
    // Hero3D init removed
    const cleanupSkills3D = initSkills3D();

    // Initialize cursor pulse animation
    setTimeout(() => {
        // startCursorPulse removed
    }, 2000);

    // Initialize glitch text effect
    setTimeout(() => {
        // startGlitchEffect removed
    }, 2500);

    // Set initial display for testimonials - with better error handling
    // Testimonials initialization removed

    // Initialize projects section
    window.filterProjects('all');

    // Start testimonial auto-slide
    // Testimonial event listeners removed

    // Event listeners
    // updateCursor listener removed

    document.querySelectorAll('a, button, .nav-toggle, .theme-toggle, .project-card, .skill-card').forEach(element => {
        element.addEventListener('mouseenter', expandCursor);
        element.addEventListener('mouseleave', shrinkCursor);
    });

    // ==================== Mobile Navigation ====================
    // Improved mobile navigation with animation
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Change icon based on menu state
        if (navLinks.classList.contains('active')) {
            navToggle.innerHTML = '<i class="fas fa-times"></i>';
            // Prevent body scrolling when menu is open
            document.body.style.overflow = 'hidden';

            // Animate links with staggered delay
            allNavLinks.forEach((link, index) => {
                link.style.opacity = '0';
                link.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    link.style.transition = 'all 0.3s ease';
                    link.style.opacity = '1';
                    link.style.transform = 'translateY(0)';
                }, 100 + (index * 50));
            });
        } else {
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            // Re-enable scrolling when menu is closed
            document.body.style.overflow = 'auto';
        }
    });

    // Close mobile menu when clicking on a link with smooth animation
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = 'auto';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !navToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = 'auto';
        }
    });

    // Theme toggle event listener removed
    // window.addEventListener('scroll', handleScroll); // Removed for performance

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            window.projectsLimit = 3; // Reset limit on filter change
            window.filterProjects(btn.dataset.filter);
        });
    });

    const viewMoreBtn = document.getElementById('view-more-projects');
    if (viewMoreBtn) {
        viewMoreBtn.onclick = (e) => {
            e.preventDefault();
            window.projectsLimit = 999;
            window.filterProjects(window.currentCategory);
        };
    }

    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });

    prevBtn.addEventListener('click', prevTestimonial);
    nextBtn.addEventListener('click', nextTestimonial);

    // Add hover animations to project cards
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -15,
                scale: 1.03,
                boxShadow: '0 20px 50px rgba(108, 99, 255, 0.3)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Clean up on unload
    window.addEventListener('unload', () => {
        cleanupHero3D();
        cleanupSkills3D();
        stopTestimonialAutoSlide();
    });

    // Initialize skill animations
    animateSkills();

    // Initialize contact animations
    initContactAnimations();
});

// ==================== Form Submission ====================
document.addEventListener('submit', function (e) {
    const form = e.target;

    if (form.classList.contains('contact-form') || form.classList.contains('newsletter-form')) {
        e.preventDefault();

        // Simulate form submission
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        submitButton.disabled = true;
        submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending...`;

        setTimeout(() => {
            form.reset();
            submitButton.innerHTML = `<i class="fas fa-check"></i> Sent Successfully!`;

            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }, 2000);
        }, 1500);
    }
});

// Stop animation when cursor leaves window
document.addEventListener('mouseleave', () => {
    if (rafID) {
        cancelAnimationFrame(rafID);
        rafID = null;
    }
});

// Restart animation when cursor enters window
document.addEventListener('mouseenter', () => {
    if (!rafID && isLoaded) {
        rafID = requestAnimationFrame(renderCursor);
    }
});

// Fix contact section visibility on window load
window.addEventListener('load', () => {
    // Force display and visibility on all contact elements
    document.querySelectorAll('.contact-section, .contact-content, .contact-info, .contact-form-container, .contact-item').forEach(el => {
        el.style.display = '';
        el.style.opacity = '1';
        el.style.visibility = 'visible';
    });

    // Re-initialize contact animations
    initContactAnimations();

    console.log("Window load: Contact section visibility enforced");
});



document.addEventListener('DOMContentLoaded', function () { const e = window.matchMedia('(min-width: 768px) and (max-width: 1024px)').matches; if (e) { const a = document.querySelector('#about .about-text'); a && (a.style.textAlign = 'center'); const b = document.querySelectorAll('#about .about-text p'); b.forEach(c => { c.style.textAlign = 'center' }); const d = document.querySelector('#about .stats-container'); d && (d.style.display = 'flex', d.style.justifyContent = 'center', d.style.margin = '2rem auto'); const f = document.querySelectorAll('#about .stat-item'); f.forEach(g => { g.style.textAlign = 'center' }) } })



// Glitch Text Effect for Hero Section
document.addEventListener('DOMContentLoaded', () => {
    // Wait for page to load completely and other animations to finish
    setTimeout(initGlitchEffect, 2200);
});

function initGlitchEffect() {
    const nameElement = document.querySelector('.glitch-text .highlight');
    if (!nameElement) return;

    const originalText = nameElement.getAttribute('data-glitch') || nameElement.textContent;
    // Extended glitch character set for more variety
    const glitchChars = '</>;#{*?$%>@&^~[]{}`!|\\+=-_:;"\',.0123456789';

    // Function to create a glitched version of the text
    function glitchText() {
        let glitched = '';
        // Increase glitch count for more intensity (2-5 characters)
        const glitchCount = Math.floor(Math.random() * 4) + 2;
        const positions = [];

        // Randomly select positions to glitch
        for (let i = 0; i < glitchCount; i++) {
            positions.push(Math.floor(Math.random() * originalText.length));
        }

        // Create glitched text by replacing characters at random positions
        for (let i = 0; i < originalText.length; i++) {
            if (positions.includes(i)) {
                glitched += glitchChars.charAt(Math.floor(Math.random() * glitchChars.length));
            } else {
                glitched += originalText.charAt(i);
            }
        }

        return glitched;
    }

    // Apply the glitch effect and then restore original text
    function applyGlitch() {
        // Apply glitch
        nameElement.textContent = glitchText();

        // Restore original text after a short delay (faster for more rapid glitching)
        setTimeout(() => {
            nameElement.textContent = originalText;
        }, 780);
    }

    // Function to create a sequence of glitches
    function glitchSequence(count, interval) {
        for (let i = 0; i < count; i++) {
            setTimeout(applyGlitch, i * interval);
        }
    }

    // Start the random glitching
    function startRandomGlitching() {
        // Random delay between 1-5 seconds (reduced for more frequent glitches)
        const delay = Math.random() * 4000 + 2500;

        setTimeout(() => {
            // Random number of glitches in sequence (3-7)
            const glitchCount = Math.floor(Math.random() * 5) + 3;
            // Faster interval for more intense effect
            glitchSequence(glitchCount, 220);

            // Continue glitching randomly
            startRandomGlitching();
        }, delay);
    }

    /* Add hover effect
    nameElement.addEventListener('mouseenter', () => {
        // More intense glitch on hover - 7 rapid glitches
        glitchSequence(7, 80);
    });
    
    // Add click effect for mobile users
    nameElement.addEventListener('click', () => {
        // Super intense glitch on click - 10 very rapid glitches
        glitchSequence(10, 60);
    });*/

    // Start random glitching
    startRandomGlitching();

    // Initial glitch effect when loaded
    setTimeout(() => {
        glitchSequence(5, 100);
    }, 500);
}


// ==================== MIGRATED SCRIPTS FROM HTML ====================


// Enhanced Realistic Smoke Cursor Effect (Fast Pure Smoke - No Dots - Zero Delay)
// Enhanced Realistic Smoke Cursor Effect (Optimized with Pre-rendering)
(function () {
    if (window.matchMedia('(max-width: 767px)').matches) return;

    const canvas = document.getElementById('cursor-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true }); // Optimize context

    let mouseX = -100;
    let mouseY = -100;
    let lastX = -100;
    let lastY = -100;
    let particles = [];

    // Pre-render the gradient particle
    const particleCanvas = document.createElement('canvas');
    const particleCtx = particleCanvas.getContext('2d');
    const particleSize = 64; // Power of 2
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
        // Optimize canvas size handling
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Don't scale context to simple pixel rendering for smoke
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
            // Rotation is less visible on round nebulas, skip for perf if needed, but keeping for fidelity
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.life * this.opacity;
            // Draw pre-rendered image instead of creating gradient
            ctx.drawImage(particleCanvas, -this.size, -this.size * 0.8, this.size * 2, this.size * 1.6);
            ctx.restore();
        }
    }

    // Rate limit mouse events
    let lastEventTime = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastEventTime < 16) return; // Cap at ~60fps input

        mouseX = e.clientX;
        mouseY = e.clientY;
        lastEventTime = now;

        const vx = mouseX - lastX;
        const vy = mouseY - lastY;

        for (let i = 0; i < 2; i++) {
            particles.push(new Particle(mouseX, mouseY, vx, vy));
        }

        lastX = mouseX;
        lastY = mouseY;
    }, { passive: true });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'screen';

        // Add particles if moving - check if moved significantly
        if (Math.abs(mouseX - lastX) > 0.5 || Math.abs(mouseY - lastY) > 0.5) {
            // Only add trails if moving enough
        } else {
            // Maybe add fewer idle particles
        }

        // Optimization: Batch drawing if possible (difficult with varying transforms)
        // Manual loop implies batching logic per particle

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.update();
            p.draw();
            if (p.life <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animate);
    }
    animate();

})();

// Project Video Performance Optimization
document.addEventListener('DOMContentLoaded', function () {
    const projectVideos = document.querySelectorAll('.vdo');

    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.play().catch(e => console.log("Video play interrupted"));
                } else {
                    entry.target.pause();
                }
            });
        }, { threshold: 0.1 });

        projectVideos.forEach(video => {
            videoObserver.observe(video);
            // Ensure muted is set for autoplay
            video.muted = true;
        });
    }
});



// --- Script Block ---


// Disable Three.js 3D model on mobile - only use Spline
document.addEventListener('DOMContentLoaded', function () {
    // Check if device is mobile
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (isMobile) {
        // Create a style element to disable Three.js canvas
        const styleEl = document.createElement('style');
        styleEl.textContent = `
                    #hero-3d-space canvas:not(canvas[data-spline-viewer]) {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                        pointer-events: none !important;
                    }
                `;
        document.head.appendChild(styleEl);

        // Prevent the initHero3D from running on mobile
        window.preventHero3D = true;
    }
});



// --- Script Block ---


document.addEventListener('DOMContentLoaded', function () {
    // Check if we're in tablet view
    if (window.matchMedia('(min-width: 768px) and (max-width: 1024px)').matches) {
        // Get the premium description elements
        const premiumDesc = document.querySelector('.premium-description');
        const firstP = document.querySelector('.premium-description p:first-child');
        const secondP = document.querySelector('.premium-description p.with-line');

        if (firstP && secondP) {
            // Fix the text layout
            const firstText = firstP.textContent.trim();
            const secondText = secondP.textContent.trim();

            // Get only the text without "with"
            const newSecondText = secondText.replace("with", "").trim();

            // Update the content
            firstP.textContent = firstText + " with";
            secondP.textContent = newSecondText;
        }
    }
});



// --- Script Block ---


// window.addEventListener('scroll', updateActiveMenuItem); // Removed for performance

// Mobile menu enhancements block removed (redundant and causing scope errors)



// --- Script Block ---


// Update current year for copyright
document.getElementById('current-year').textContent = new Date().getFullYear();



// --- Script Block ---


// window.addEventListener('scroll', highlightActiveSection); // Removed for performance



// --- Script Block ---


// Use direct script instead of event listener to avoid errors
(function () {
    // This runs immediately
    try {
        // Check for tablet view
        if (window.matchMedia('(min-width: 768px) and (max-width: 1024px)').matches) {
            console.log("APPLYING FORCE RESIZE FOR TABLET");

            // Try to find the 3D model viewer - use timeout to ensure DOM is ready
            setTimeout(function () {
                const splineViewer = document.querySelector('spline-viewer');
                if (splineViewer) {
                    console.log("Found spline viewer, applying styles");
                    // Force styling with !important flags
                    splineViewer.style.cssText =
                        "transform: translateX(9%) scale(1.5) !important;" +
                        "width: 100% !important;" +
                        "height: 100% !important;" +
                        "min-height: 100% !important;" +
                        "max-width: 100% !important;" +
                        "max-height: 100% !important;" +
                        "background: transparent !important;" +
                        "box-shadow: none !important;";

                    console.log("Applied styling to spline viewer");

                    // Also style the container
                    const container = document.querySelector('.hero-3d-container');
                    if (container) {
                        container.style.height = '550px';
                        container.style.minHeight = '550px';
                        container.style.maxHeight = '550px';
                        container.style.background = 'transparent';
                        container.style.boxShadow = 'none';
                        console.log("Applied styling to container");
                    }

                    // Hide Three.js canvases
                    const canvases = document.querySelectorAll('#hero-3d-space canvas:not([data-spline-viewer])');
                    if (canvases && canvases.length > 0) {
                        canvases.forEach(function (canvas) {
                            if (canvas) {
                                canvas.style.display = 'none';
                                canvas.style.visibility = 'hidden';
                                canvas.style.opacity = '0';
                            }
                        });
                        console.log("Hidden other canvases");
                    }
                } else {
                    console.log("Spline viewer not found");
                }
            }, 500);

            // Try again after full page load
            window.addEventListener('load', function () {
                const splineViewer = document.querySelector('spline-viewer');
                if (splineViewer) {
                    splineViewer.style.transform = "translateX(9%) scale(1.5)";
                    console.log("Applied transform on window load");
                }
            });
        }
    } catch (err) {
        console.error("Error in tablet 3D model script:", err);
    }
})();



// --- Script Block ---


// Mobile menu toggle function
function toggleMobileMenu(el) {
    const navLinks = document.querySelector('.nav-links');
    const icon = el.querySelector('i');

    if (navLinks.classList.contains('active')) {
        // Close menu
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        el.classList.remove('active');

        // Change icon
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');

        // Remove overlay if it exists
        const overlay = document.querySelector('.menu-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
    } else {
        // Open menu
        navLinks.classList.add('active');
        document.body.classList.add('menu-open');
        el.classList.add('active');

        // Change icon
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        overlay.style.cssText = `
                            position: fixed;
                            top: 65px;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: rgba(0, 0, 0, 0.5);
                            backdrop-filter: blur(3px);
                            -webkit-backdrop-filter: blur(3px);
                            z-index: 999;
                            opacity: 0;
                            transition: opacity 0.3s ease;
                        `;
        document.body.appendChild(overlay);

        // Add click event to close menu when overlay is clicked
        overlay.addEventListener('click', function () {
            toggleMobileMenu(el);
        });

        // Fade in overlay
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
    }
}

// Close menu when clicking on links
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.querySelector('.nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinksContainer.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuToggle.classList.remove('active');

            // Reset icon
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }

            // Remove overlay if it exists
            const overlay = document.querySelector('.menu-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.remove();
                }, 300);
            }
        });
    });
});



// --- Script Block ---


// Add typing animation completion
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        const nameElement = document.querySelector('.animated-name');
        if (nameElement) {
            nameElement.classList.add('completed');
        }
    }, 3000); // Match to typing animation duration
});



// --- Script Block ---


// Wait for DOM and Spline to load
document.addEventListener('DOMContentLoaded', function () {
    // Give time for Spline to initialize
    setTimeout(function () {
        positionSplineModel();

        // Add resize handler with debounce
        let resizeTimeout;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(positionSplineModel, 100);
        });
    }, 1000);

    // Position model based on screen size
    function positionSplineModel() {
        const splineViewer = document.querySelector('spline-viewer');
        if (!splineViewer) return;

        // Reset any existing transform
        splineViewer.style.transform = '';

        // Mobile vs desktop positioning
        if (window.innerWidth <= 767) {
            // Mobile - shift left to center the model (-25%)
            splineViewer.style.transform = 'translateX(-25%)';

            // Add watermark blocker on mobile
            addWatermarkBlocker();
        } else {
            // Desktop - larger right shift (30%) - unchanged
            splineViewer.style.transform = 'translateX(30%)';
        }

        // Mobile vs desktop positioning
        if (window.innerWidth <= 767) {
            // Mobile - shift further left to center the model (-40%)
            splineViewer.style.transform = 'translateX(-40%)';

            // Add watermark blocker on mobile
            addWatermarkBlocker();
        } else {
            // Desktop - larger right shift (30%) - unchanged
            splineViewer.style.transform = 'translateX(30%)';
        }
    }

    // Handle Spline watermark
    function addWatermarkBlocker() {
        if (window.innerWidth > 767) return; // Only on mobile

        const container = document.getElementById('hero-3d-space');
        if (!container) return;

        // Remove existing blockers
        const existingBlockers = container.querySelectorAll('.spline-watermark-blocker');
        existingBlockers.forEach(el => el.remove());

        // Add new blocker
        const blocker = document.createElement('div');
        blocker.className = 'spline-watermark-blocker';
        container.appendChild(blocker);
    }
});



// --- Script Block ---


// Update current year for copyright
document.getElementById('current-year').textContent = new Date().getFullYear();

// Mobile Navigation Toggle - FIXED VERSION
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM loaded - initializing mobile menu");

    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    console.log("Menu elements:", { navToggle, navLinks, navLinksItems });

    // Create overlay for closing menu when clicking outside
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);

    // Style the overlay
    overlay.style.cssText = `
                position: fixed;
                top: 65px;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 999;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease;
                backdrop-filter: blur(3px);
                -webkit-backdrop-filter: blur(3px);
            `;

    // Toggle mobile menu with direct class manipulation
    if (navToggle) {
        console.log("Adding click listener to menu toggle");

        navToggle.addEventListener('click', function (e) {
            console.log("Menu button clicked!");
            e.stopPropagation();
            e.preventDefault();

            // Direct class manipulation
            if (navLinks.classList.contains('active')) {
                console.log("Closing menu");
                navLinks.classList.remove('active');
                overlay.classList.remove('active');
                document.body.classList.remove('menu-open');
                navToggle.classList.remove('active'); // Remove active class from toggle button

                // Reset icon to bars with animation
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                    setTimeout(() => {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }, 150);
                }

                // Hide overlay
                overlay.style.opacity = '0';
                overlay.style.visibility = 'hidden';
            } else {
                console.log("Opening menu");
                navLinks.classList.add('active');
                overlay.classList.add('active');
                document.body.classList.add('menu-open');
                navToggle.classList.add('active'); // Add active class to toggle button

                // Change icon to times (X) with animation
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.style.transform = 'rotate(90deg)';
                    setTimeout(() => {
                        icon.classList.remove('fa-bars');
                        icon.classList.add('fa-times');
                        icon.style.transform = 'rotate(0deg)';
                    }, 150);
                }

                // Show overlay
                overlay.style.opacity = '1';
                overlay.style.visibility = 'visible';
            }
        });
    }

    // Close menu when clicking on a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            navToggle.classList.remove('active'); // Remove active class from toggle button

            // Reset icon to bars
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }

            // Hide overlay
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
        });
    });

    // Close menu when clicking on overlay
    overlay.addEventListener('click', function () {
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        navToggle.classList.remove('active'); // Remove active class from toggle button

        // Reset icon to bars
        const icon = navToggle.querySelector('i');
        if (icon) {
            icon.style.transform = 'rotate(0deg)';
            setTimeout(() => {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }, 150);
        }

        // Hide overlay
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
    });

    // Close menu when window is resized to desktop size
    window.addEventListener('resize', function () {
        if (window.innerWidth > 767) {
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            navToggle.classList.remove('active'); // Remove active class from toggle button

            // Reset icon to bars
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }

            // Hide overlay
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
        }
    });
});



// --- Script Block ---


// Testimonial slider functionality - completely rewritten
document.addEventListener('DOMContentLoaded', function () {
    // Get all testimonial elements
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-controls .dot');
    const prevBtn = document.querySelector('.testimonial-controls .prev');
    const nextBtn = document.querySelector('.testimonial-controls .next');

    // No cards? Exit early
    if (!cards.length) return;

    let currentIndex = 0;

    // Initialize: show first card, hide the rest
    function initCarousel() {
        cards.forEach((card, index) => {
            if (index === 0) {
                card.classList.add('active-card');
            } else {
                card.classList.remove('active-card');
            }
            // Force display property to prevent quirks
            card.style.display = index === 0 ? 'block' : 'none';
        });

        // Set first dot as active
        if (dots.length) {
            dots[0].classList.add('active');
        }
    }

    // Show specific slide
    function showSlide(index) {
        // Validate index
        if (index < 0) index = cards.length - 1;
        if (index >= cards.length) index = 0;

        // Hide all cards
        cards.forEach((card, i) => {
            card.classList.remove('active-card');
            card.style.display = 'none';

            // Update dots
            if (dots[i]) {
                dots[i].classList.remove('active');
            }
        });

        // Show selected card
        cards[index].classList.add('active-card');
        cards[index].style.display = 'block';

        // Update active dot
        if (dots[index]) {
            dots[index].classList.add('active');
        }

        // Update current index
        currentIndex = index;

        // Log for debugging
        console.log('Changed to slide', index);
    }

    // Next slide
    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    // Previous slide
    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    // Set up event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function () {
            showSlide(index);
        });
    });

    // Initialize on page load
    initCarousel();

    // Optional: Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
});



// --- Script Block ---


// Auto rotation for testimonials
document.addEventListener('DOMContentLoaded', function () {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-controls .dot');

    // Find the active slide index
    function getActiveIndex() {
        for (let i = 0; i < testimonialCards.length; i++) {
            if (testimonialCards[i].style.opacity === '1') {
                return i;
            }
        }
        return 0; // Default to first slide
    }

    // Trigger click on next button every 5 seconds
    setInterval(function () {
        const nextBtn = document.querySelector('.control-btn.next');
        if (nextBtn) {
            nextBtn.click();
        }
    }, 5000);
});



// --- Script Block ---


// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', function () {
    // Only on mobile
    if (window.matchMedia('(max-width: 767px)').matches) {
        console.log("Mobile detected, hiding Spline watermark");

        // Remove watermark after Spline loads
        setTimeout(removeSplineWatermark, 1000);
        setTimeout(removeSplineWatermark, 2000);
        setTimeout(removeSplineWatermark, 3000);

        // Create a blocker element
        createWatermarkBlocker();

        // Monitor for changes and keep removing watermark
        setInterval(removeSplineWatermark, 2000);
    }

    function createWatermarkBlocker() {
        const heroContainer = document.getElementById('hero-3d-space');
        if (!heroContainer) return;

        const blocker = document.createElement('div');
        blocker.className = 'spline-watermark-blocker';
        blocker.id = 'spline-watermark-blocker';

        heroContainer.style.position = 'relative';
        heroContainer.appendChild(blocker);

        console.log("Added watermark blocker element");
    }

    function removeSplineWatermark() {
        const selectors = [
            'spline-viewer a',
            'spline-viewer a[target="_blank"]',
            'spline-viewer div[class*="logo"]',
            'spline-viewer div[class*="watermark"]',
            'spline-viewer > div > div > a',
            'spline-viewer iframe',
            'spline-viewer [data-name*="logo"]',
            'spline-viewer [data-name*="watermark"]',
            'spline-viewer > div > div:last-child'
        ];

        let found = 0;

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = 'none';
                el.style.opacity = '0';
                el.style.visibility = 'hidden';
                el.style.width = '0';
                el.style.height = '0';
                el.style.overflow = 'hidden';
                el.style.position = 'absolute';
                el.style.zIndex = '-99999';
                el.style.pointerEvents = 'none';

                found++;

                try {
                    el.remove();
                } catch (e) {
                    console.log("Couldn't remove element, hiding instead");
                }
            });
        });

        if (found > 0) {
            console.log(`Removed/hid ${found} potential watermark elements`);
        }
    }
});



// --- Script Block ---


// Check if device is tablet and apply special positioning - IMPROVED VERSION
document.addEventListener('DOMContentLoaded', function () {
    const isTablet = window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches;

    if (isTablet) {
        console.log("Tablet detected - applying IMPROVED layout fix");

        // Function to apply tablet layout fix
        function applyTabletFix() {
            try {
                // Get the hero section elements
                const heroSection = document.querySelector('.hero-section');
                const heroContent = document.querySelector('.hero-content');
                const modelContainer = document.querySelector('.hero-3d-container');

                if (!heroSection || !heroContent || !modelContainer) {
                    console.log("Hero elements not ready yet, will retry...");
                    return false; // Elements not found yet
                }

                // Make sure 3D model loads properly
                const splineViewer = document.querySelector('spline-viewer');
                if (splineViewer) {
                    // Fix spline viewer styling
                    splineViewer.style.transform = 'translateX(8%) scale(1.4)';
                    splineViewer.style.width = '100%';
                    splineViewer.style.height = '100%';
                    splineViewer.style.opacity = '1';
                    splineViewer.style.visibility = 'visible';
                    splineViewer.style.display = 'block';
                    splineViewer.style.background = 'transparent';
                    splineViewer.style.boxShadow = 'none';

                    // Set loading="eager" to prioritize loading
                    splineViewer.setAttribute('loading', 'eager');

                    // Create additional watermark blocker
                    const watermarkBlocker = document.createElement('div');
                    watermarkBlocker.style.cssText = `
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
                    modelContainer.appendChild(watermarkBlocker);

                    console.log("Fixed spline viewer styling for tablet");
                }

                // Ensure the hero section has grid layout
                heroSection.style.display = 'grid';
                heroSection.style.gridTemplateColumns = '1fr';
                heroSection.style.gridTemplateRows = 'auto auto';
                heroSection.style.padding = '120px 20px 80px 20px';
                heroSection.style.height = 'auto';
                heroSection.style.minHeight = '100vh';

                // Ensure model container is in the first row
                if (modelContainer && heroContent) {
                    modelContainer.style.gridRow = '1';
                    heroContent.style.gridRow = '2';
                }

                // Center all text elements
                const textElements = heroContent.querySelectorAll('.hero-title, .animated-name-wrapper, .subtitle, .premium-description, .cta-buttons, .social-links');
                textElements.forEach(el => {
                    if (el) {
                        el.style.textAlign = 'center';
                        el.style.justifyContent = 'center';
                        el.style.marginLeft = 'auto';
                        el.style.marginRight = 'auto';
                        el.style.width = '100%';
                    }
                });

                console.log("Successfully applied tablet layout styling");
                return true; // Successfully applied
            } catch (error) {
                console.error("Error applying tablet fix:", error);
                return false;
            }
        }

        // First try immediate application
        let applied = applyTabletFix();

        // If not successful, try with increasing delays
        if (!applied) {
            const delays = [100, 300, 500, 1000, 2000, 3000];
            delays.forEach(function (delay) {
                setTimeout(function () {
                    if (!applied) {
                        applied = applyTabletFix();
                    }
                }, delay);
            });
        }

        // Also apply on window load for extra reliability
        window.addEventListener('load', applyTabletFix);

        // Listen for resize events to ensure fix stays applied
        window.addEventListener('resize', function () {
            // Only apply if still in tablet view
            if (window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches) {
                applyTabletFix();
            }
        });
    }

    // Ensure section is tall enough
    if (heroSection) {
        heroSection.style.cssText = `
                            position: relative !important;
                            display: flex !important;
                            flex-direction: column !important;
                            padding-top: 65px !important;
                            min-height: 900px !important;
                        `;
    }

    // Extra styling for Spline
    const splineViewer = document.querySelector('spline-viewer');
    if (splineViewer) {
        splineViewer.style.cssText = `
                            transform: translateX(12%) scale(1.5) !important;
                            margin: 0 auto !important;
                            position: relative !important;
                            display: block !important;
                            opacity: 1 !important;
                            z-index: 999 !important;
                            visibility: visible !important;
                            background: transparent !important;
                            box-shadow: none !important;
                        `;
    }

    // Hide any Three.js canvases
    const canvases = document.querySelectorAll('#hero-3d-space canvas:not([data-spline-viewer])');
    canvases.forEach(function (canvas) {
        canvas.style.display = 'none';
        canvas.style.visibility = 'hidden';
        canvas.style.opacity = '0';
        canvas.style.position = 'absolute';
        canvas.style.zIndex = '-9999';
        canvas.style.pointerEvents = 'none';
        canvas.width = 0;
        canvas.height = 0;
    });
}

);



// --- Script Block ---


// Update current year for copyright
document.getElementById('current-year').textContent = new Date().getFullYear();



// --- Script Block ---


// Execute immediately to ensure it works
(function () {
    console.log("Mobile menu fix script running");

    // Get elements
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!navToggle || !navLinks) {
        console.error("Menu elements not found:", { navToggle, navLinks });
        return;
    }

    console.log("Menu elements found:", { navToggle, navLinks });

    // Direct click handler - no event delegation
    navToggle.onclick = function (e) {
        e.preventDefault();
        console.log("Menu button clicked!");

        // Toggle active class on menu
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
            navToggle.classList.remove('active');

            // Change icon
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        } else {
            navLinks.classList.add('active');
            document.body.classList.add('menu-open');
            navToggle.classList.add('active');

            // Change icon
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        }
    };

    // Close menu when clicking on links
    const navLinksItems = document.querySelectorAll('.nav-link');
    navLinksItems.forEach(link => {
        link.onclick = function () {
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
            navToggle.classList.remove('active');

            // Change icon
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        };
    });
})();


// Spline Loader Logic
document.addEventListener('DOMContentLoaded', function () {
    const splineViewer = document.querySelector('spline-viewer');
    const loader = document.getElementById('spline-loader');

    if (splineViewer && loader) {
        // Function to hide loader
        const hideLoader = () => {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 200); // Short timeout just for fade effect
        };

        // Listen for load event
        splineViewer.addEventListener('load', hideLoader);

        // Fallback timeout - force hide after 1.5s as requested
        setTimeout(hideLoader, 1500);
    }
});
