/* ========================================== */
/* RIDMA HASARANGA PORTFOLIO - MAIN SCRIPT   */
/* ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // LOADING SCREEN
    // ==========================================
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) loader.classList.add('hidden');
        }, 1000);
    });

    // ==========================================
    // CUSTOM CURSOR EFFECT
    // ==========================================
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');

    if (cursor && cursorFollower && window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';

            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 100);
        });

        // Add hover effect to interactive elements
        const hoverables = document.querySelectorAll('a, button, .btn, .portfolio-item, .service-card, .filter-btn, .social-link, .prev-btn, .next-btn, .dot');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    } else if (cursor && cursorFollower) {
        // Hide custom cursor on touch devices
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
    }

    // ==========================================
    // NAVIGATION BAR
    // ==========================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky navbar effect on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // THREE.JS 3D ANIMATED BACKGROUND
    // ==========================================
    const canvasContainer = document.getElementById('canvas-container');

    if (canvasContainer && typeof THREE !== 'undefined') {
        // Scene setup
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050508, 0.08); // Depth fog

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performance optimization
        canvasContainer.appendChild(renderer.domElement);

        // --- Floating Particle System ---
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1200;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            // Spread particles in a spherical area
            posArray[i] = (Math.random() - 0.5) * 8;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: 0x00f2ff,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // --- Central 3D Abstract Object (Wireframe Icosahedron) ---
        const geometry = new THREE.IcosahedronGeometry(1.2, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 0x7000ff,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // --- Inner Core Crystal ---
        const coreGeo = new THREE.IcosahedronGeometry(0.7, 0);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0x00f2ff,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        scene.add(core);

        camera.position.z = 4;

        // --- Mouse Interaction Variables ---
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // --- Animation Loop ---
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Smooth mouse parallax
            targetX = mouseX * 0.5;
            targetY = mouseY * 0.5;

            // Rotate central object
            sphere.rotation.y += 0.002;
            sphere.rotation.x += 0.001;

            // Rotate inner core (opposite direction)
            core.rotation.y -= 0.005;
            core.rotation.x -= 0.002;

            // Apply parallax tilt based on mouse position
            sphere.rotation.y += 0.05 * (targetX - sphere.rotation.y);
            sphere.rotation.x += 0.05 * (targetY - sphere.rotation.x);

            // Rotate particles slowly + mouse influence
            particlesMesh.rotation.y = mouseX * 0.1 + elapsedTime * 0.05;
            particlesMesh.rotation.x = mouseY * 0.1;

            // Pulse effect for inner core
            const scale = 1 + Math.sin(elapsedTime * 0.5) * 0.05;
            core.scale.set(scale, scale, scale);

            renderer.render(scene, camera);
        }
        animate();

        // --- Resize Handler ---
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // ==========================================
    // GSAP ANIMATIONS
    // ==========================================
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero text stagger animation
        gsap.from('.hero-text > *', {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            delay: 0.5
        });

        // Hero image animation
        gsap.from('.hero-image-wrapper', {
            scale: 0.8,
            opacity: 0,
            duration: 1.2,
            ease: 'back.out(1.7)',
            delay: 0.3
        });

        // Section headers reveal
        gsap.utils.toArray('.section').forEach(section => {
            const header = section.querySelector('.section-header');
            if (header) {
                gsap.from(header, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    },
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out'
                });
            }
        });
    }

    // ==========================================
    // SCROLLREVEAL ANIMATIONS
    // ==========================================
    if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
            origin: 'bottom',
            distance: '30px',
            duration: 1000,
            delay: 200,
            easing: 'cubic-bezier(0.5, 0, 0, 1)',
            reset: false
        });

        sr.reveal('.service-card', { interval: 150 });
        sr.reveal('.portfolio-item', { interval: 100 });
        sr.reveal('.stat-card', { interval: 150 });
        sr.reveal('.info-card', { interval: 150 });
        sr.reveal('.about-image-wrapper', { origin: 'left', distance: '50px', duration: 1200 });
        sr.reveal('.about-text', { origin: 'right', distance: '50px', duration: 1200 });
        sr.reveal('.skills-image', { origin: 'left', distance: '50px', duration: 1200 });
        sr.reveal('.skills-bars', { origin: 'right', distance: '50px', duration: 1200 });
        sr.reveal('.contact-form-wrapper', { origin: 'left', distance: '50px', duration: 1200 });
        sr.reveal('.contact-info', { origin: 'right', distance: '50px', duration: 1200 });
    }

    // ==========================================
    // PORTFOLIO FILTERING
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    // Initialize: show all items
    portfolioItems.forEach(item => item.classList.add('show'));

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                item.classList.remove('show');
                // Trigger reflow to restart animation
                void item.offsetWidth;

                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.add('show');
                }
            });
        });
    });

    // ==========================================
    // LIGHTBOX FUNCTIONALITY
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightbox) {
        // Open lightbox
        document.querySelectorAll('.portfolio-zoom').forEach(zoom => {
            zoom.addEventListener('click', (e) => {
                e.preventDefault();
                const portfolioItem = zoom.closest('.portfolio-item');
                const img = portfolioItem.querySelector('img');
                const title = portfolioItem.querySelector('h3').innerText;

                lightboxImg.src = img.src;
                lightboxCaption.innerText = title;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        });

        // Close lightbox functions
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        lightboxClose.addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // ==========================================
    // TESTIMONIALS SLIDER
    // ==========================================
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        // Remove active class from all
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current
        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
            showTestimonial(currentTestimonial);
        });

        prevBtn.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
            showTestimonial(currentTestimonial);
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentTestimonial = index;
            showTestimonial(currentTestimonial);
        });
    });

    // Auto-play testimonials (optional)
    setInterval(() => {
        if (!document.querySelector('.testimonials-slider:hover')) {
            currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
            showTestimonial(currentTestimonial);
        }
    }, 6000);

    // ==========================================
    // SKILLS PROGRESS BARS ANIMATION
    // ==========================================
    const skillBars = document.querySelectorAll('.skill-progress');

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetWidth = entry.target.getAttribute('data-width');
                entry.target.style.width = targetWidth;
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillsObserver.observe(bar));

    // ==========================================
    // STATISTICS COUNTERS ANIMATION
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number');

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Ease out quart
                    const easeOut = 1 - Math.pow(1 - progress, 4);
                    const current = Math.floor(easeOut * target);

                    entry.target.innerText = current + '+';

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        entry.target.innerText = target + '+';
                    }
                }

                requestAnimationFrame(updateCounter);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));

    // ==========================================
    // CONTACT FORM HANDLING
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values (optional: you can send these to a backend)
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

        // create massage
    const fullMessage = `New Portfolio Message\n\n` +
                    `Name: ${name}\n` +
                    `Email: ${email}\n` +
                    `Subject: ${subject}\n\n` +
                    `Message:\n${message}`;

    const url = `https://wa.me/94760329017?text=${encodeURIComponent(fullMessage)}`;

        // WhatsApp open
        window.open(url, '_blank');
            // Show success message
            alert(`Thank you, ${name}! Your message has been received. I will contact you at ${email} soon.`);

            // Reset form
            contactForm.reset();
        });
    }

    // ==========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70; // Account for navbar height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // FLOATING ICONS PARALLAX EFFECT
    // ==========================================
    const floatingIcons = document.querySelectorAll('.floating-icon');

    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;

        floatingIcons.forEach((icon, index) => {
            const speed = (index + 1) * 0.5;
            icon.style.transform = `translate(${x * speed}px, ${y * speed}px) rotate(${x * 2}deg)`;
        });
    });

    // ==========================================
    // PERFORMANCE: PAUSE ANIMATIONS WHEN TAB HIDDEN
    // ==========================================
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Optionally pause expensive animations here
            // For Three.js, the loop continues but we could optimize if needed
        }
    });

    console.log('%c Ridma Hasaranga Portfolio ', 'background: linear-gradient(135deg, #00f2ff, #7000ff); color: #050508; font-size: 20px; font-weight: bold; padding: 10px; border-radius: 10px;');
    console.log('%c Designed & Developed with passion ', 'color: #00f2ff; font-size: 14px;');

}); // End DOMContentLoaded
