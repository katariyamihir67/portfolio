/* ============================================
   PORTFOLIO — script.js
   Mihir Katariya — Flutter Developer
   Highly Animated Version (GSAP + Lenis)
   ============================================ */

(function () {
    'use strict';

    // ——————————————————————————————————————————
    // 0. INITIAL SETUP & LENIS (SMOOTH SCROLL)
    // ——————————————————————————————————————————
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Initialize Lenis
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // ——————————————————————————————————————————
    // 1. MAGNETIC CURSOR GLOW (GSAP Powered)
    // ——————————————————————————————————————————
    const cursorGlow = document.getElementById('cursorGlow');
    
    // Set initial GSAP state
    gsap.set(cursorGlow, { xPercent: -50, yPercent: -50 });

    let xTo = gsap.quickTo(cursorGlow, "x", {duration: 0.4, ease: "power3"}, {initial: true});
    let yTo = gsap.quickTo(cursorGlow, "y", {duration: 0.4, ease: "power3"}, {initial: true});

    document.addEventListener('mousemove', (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
    });

    const interactives = document.querySelectorAll('a, button, .skill-card, .project-card, .education-card, .timeline-content, .contact-item');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursorGlow, { scale: 1.8, duration: 0.3, ease: "power2.out", opacity: 0.8 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursorGlow, { scale: 1, duration: 0.3, ease: "power2.out", opacity: 0.5 });
        });
    });

    // ——————————————————————————————————————————
    // 2. HERO PARTICLE CANVAS (Kept intact, it's good)
    // ——————————————————————————————————————————
    const canvas = document.getElementById('heroParticles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const PARTICLE_COUNT = 80;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.hue = Math.random() > 0.5 ? 190 : 270;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 140) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${0.06 * (1 - dist / 140)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawLines();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ——————————————————————————————————————————
    // 3. PRELOADER & GSAP HERO ENTRANCE ANIMATION
    // ——————————————————————————————————————————
    // Wait for DOM
    window.addEventListener("load", () => {
        // Initial setup for reveal text
        gsap.set(".reveal-text", { y: 50, opacity: 0 });
        gsap.set(".hero-flutter-logo", { scale: 0.5, opacity: 0, rotation: -20 });
        gsap.set(".hero-badges .hero-badge", { scale: 0, opacity: 0 });
        gsap.set(".hero-code-block", { x: -50, opacity: 0 });

        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Preloader Animation
        const preloader = document.getElementById("preloader");
        const preText = document.getElementById("preloaderText");
        
        let loaderObj = { value: 0 };
        const preloaderTl = gsap.timeline({
            onComplete: () => {
                lenis.start(); // Ensure scrolling is re-enabled if stopped
            }
        });

        // Stop scrolling while loading
        lenis.stop();

        preloaderTl
        .to(loaderObj, {
            value: 100,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: function() {
                if (preText) preText.innerText = Math.floor(loaderObj.value) + "%";
            }
        })
        .to(".preloader-logo", {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power2.inOut"
        }, "-=2")
        .to(".preloader-content", { opacity: 0, duration: 0.5, y: -20 }, "+=0.2")
        .to(preloader, {
            yPercent: -100,
            duration: 0.8,
            ease: "power3.inOut"
        })
        .set(preloader, { display: "none" });

        // Hero Animation Sequence (starts right as preloader slides up)
        heroTl
        .to(".reveal-text", {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.15
        }, 0) // Align to start of heroTl
        // Pop in flutter logo
        .to(".hero-flutter-logo", {
            scale: 1,
            opacity: 0.5,
            rotation: 0,
            duration: 1.5,
            ease: "elastic.out(1, 0.5)"
        }, "-=1")
        // Slide in code block
        .to(".hero-code-block", {
            x: 0,
            opacity: 1,
            duration: 1,
        }, "-=1.2")
        // Pop in badges
        .to(".hero-badges .hero-badge", {
            scale: 1,
            opacity: 0.5,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }, "-=0.8");

        // Chain timelines
        preloaderTl.add(heroTl, "-=0.4");
    });

    // ——————————————————————————————————————————
    // 4. GSAP SCROLLTRIGGER ANIMATIONS
    // ——————————————————————————————————————————

    // Global: Parallax Background elements
    gsap.to("body::before", {
        y: "20%",
        ease: "none",
        scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: true }
    });

    // About Section
    const aboutTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#about",
            start: "top 75%",
            end: "bottom 80%",
            toggleActions: "play none none reverse"
        }
    });

    aboutTl.fromTo(".about-image-wrapper", 
        { opacity: 0, x: -50, rotation: -5 },
        { opacity: 1, x: 0, rotation: 0, duration: 1.2, ease: "power3.out" }
    )
    .fromTo(".about-text p", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" },
        "-=0.8"
    )
    .fromTo(".stat-item", 
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.5)" },
        "-=0.4"
    );

    // Number counting animation via GSAP for stats
    document.querySelectorAll('.stat-number').forEach(stat => {
        ScrollTrigger.create({
            trigger: stat,
            start: "top 85%",
            once: true,
            onEnter: () => {
                let target = parseInt(stat.dataset.count);
                gsap.fromTo(stat, 
                    { innerText: 0 }, 
                    { innerText: target, duration: 2, ease: "power2.out", snap: { innerText: 1 }, 
                      onUpdate: function() { stat.innerText = Math.floor(this.targets()[0].innerText); }
                    }
                );
            }
        });
    });

    // Skills Section (Staggered 3D Flip)
    gsap.fromTo(".skill-card",
        { opacity: 0, y: 60, rotationX: -15, transformPerspective: 1000 },
        { 
            opacity: 1, y: 0, rotationX: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: "#skills",
                start: "top 75%",
            }
        }
    );

    // Animate skill bars
    document.querySelectorAll('.skill-fill').forEach(bar => {
        ScrollTrigger.create({
            trigger: bar,
            start: "top 85%",
            onEnter: () => {
                gsap.to(bar, { width: bar.dataset.level + "%", duration: 1.5, ease: "power3.out" });
            }
        });
    });

    // Projects Section
    gsap.fromTo(".project-card",
        { opacity: 0, y: 80, scale: 0.95 },
        { 
            opacity: 1, y: 0, scale: 1,
            duration: 1.2,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: "#projects",
                start: "top 75%",
            }
        }
    );

    // Education Section
    gsap.fromTo(".education-card",
        { opacity: 0, x: -30 },
        { 
            opacity: 1, x: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: "#education",
                start: "top 75%",
            }
        }
    );

    // Experience Timeline Section
    gsap.fromTo(".timeline-item",
        { opacity: 0, x: 40 },
        { 
            opacity: 1, x: 0,
            duration: 0.8,
            stagger: 0.3,
            ease: "power3.out",
            scrollTrigger: {
                trigger: "#experience",
                start: "top 75%",
            }
        }
    );

    // Timeline line draw effect
    gsap.fromTo(".timeline::before", 
        { height: "0%" },
        { 
            height: "100%", 
            ease: "none",
            scrollTrigger: {
                trigger: ".timeline",
                start: "top 60%",
                end: "bottom 60%",
                scrub: true
            }
        }
    );

    // Contact Section
    gsap.fromTo(".contact-text > *",
        { opacity: 0, y: 30 },
        { 
            opacity: 1, y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: "#contact",
                start: "top 75%",
            }
        }
    );

    gsap.fromTo(".contact-form",
        { opacity: 0, x: 50 },
        { 
            opacity: 1, x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: "#contact",
                start: "top 75%",
            }
        }
    );

    // ——————————————————————————————————————————
    // 5. TYPEWRITER EFFECT
    // ——————————————————————————————————————————
    const typewriterEl = document.getElementById('typewriter');
    if (typewriterEl) {
        const phrases = [
            'Flutter Developer',
            'Mobile App Engineer',
            'Clean UI Enthusiast',
            'Dart Specialist'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }

            let delay = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === currentPhrase.length) {
                delay = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                delay = 500;
            }

            setTimeout(typeEffect, delay);
        }
        setTimeout(typeEffect, 1200);
    }

    // ——————————————————————————————————————————
    // 6. NAVBAR — SCROLL STATE
    // ——————————————————————————————————————————
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Highlight active section
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateNavbar);
    updateNavbar();

    // Mobile Nav Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });

        navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
            });
        });
    }

    // Smooth Anchor Scroll with Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                lenis.scrollTo(target, { offset: -80 });
            }
        });
    });

    // ——————————————————————————————————————————
    // 7. CONTACT FORM (client-side only)
    // ——————————————————————————————————————————
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('formName').value.trim();
            const email = document.getElementById('formEmail').value.trim();
            const message = document.getElementById('formMessage').value.trim();

            if (!name || !email || !message) return;

            const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
            const body = encodeURIComponent(
                `Hi Mihir,\n\n${message}\n\n— ${name}\nEmail: ${email}`
            );
            window.location.href = `mailto:katariyamihir67@gmail.com?subject=${subject}&body=${body}`;
            showToast('✓ Opening your email client...');
        });
    }

    function showToast(message) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span class="toast-icon">✉</span> ${message}`;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    // ==========================================
    // 8. PROJECT DEMO MODAL (WITH SIMULATED APP DEMOS)
    // ==========================================
    const modal = document.getElementById("projectModal");
    const modalCloseBtn = document.getElementById("modalClose");
    const modalTitle = document.getElementById("modalTitle");
    const mobileFrame = document.querySelector(".mobile-frame");

    let demoTimeline = null;

    const mockups = {
        "Urban Cafe": `
            <div class="mockup-container">
                <div class="demo-cursor" id="demoCursor"></div>
                <div class="cafe-app" id="appScroll">
                    <div class="cafe-header">
                        <div class="cafe-title">Urban Cafe</div>
                        <div>☕</div>
                    </div>
                    <div class="cafe-search">Search coffee...</div>
                    <div class="cafe-categories">
                        <div class="cafe-cat active">All</div>
                        <div class="cafe-cat">Espresso</div>
                        <div class="cafe-cat">Latte</div>
                        <div class="cafe-cat">Mocha</div>
                    </div>
                    <div class="cafe-items">
                        <div class="cafe-item" id="cafeItem1">
                            <div class="cafe-img"></div>
                            <div class="cafe-info">
                                <div class="cafe-name">Cappuccino</div>
                                <div class="cafe-desc">With oat milk</div>
                                <div class="cafe-price-row">
                                    <span class="cafe-price">$4.50</span>
                                    <div class="cafe-add" id="addBtn">+</div>
                                </div>
                            </div>
                        </div>
                        <div class="cafe-item">
                            <div class="cafe-img"></div>
                            <div class="cafe-info">
                                <div class="cafe-name">Vanilla Latte</div>
                                <div class="cafe-desc">Extra shot</div>
                                <div class="cafe-price-row">
                                    <span class="cafe-price">$5.00</span>
                                    <div class="cafe-add">+</div>
                                </div>
                            </div>
                        </div>
                        <div class="cafe-item">
                            <div class="cafe-img"></div>
                            <div class="cafe-info">
                                <div class="cafe-name">Flat White</div>
                                <div class="cafe-desc">Whole milk</div>
                                <div class="cafe-price-row">
                                    <span class="cafe-price">$4.00</span>
                                    <div class="cafe-add">+</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        "FitBody App": `
            <div class="mockup-container">
                <div class="demo-cursor" id="demoCursor"></div>
                <div class="fit-app" id="appScroll">
                    <div class="fit-header">
                        <div class="fit-greeting">Good Morning,</div>
                        <div class="fit-name">Mihir!</div>
                    </div>
                    <div class="fit-stats">
                        <div class="fit-stat-box">
                            <div class="fit-ring">75%</div>
                            <div class="fit-stat-label">Activity</div>
                        </div>
                        <div class="fit-stat-box">
                            <div class="fit-ring" style="border-top-color: #f43f5e">8h</div>
                            <div class="fit-stat-label">Sleep</div>
                        </div>
                    </div>
                    <div class="fit-section-title">Today's Workouts</div>
                    <div class="fit-workout" id="workout1">
                        <div class="fit-w-title">Full Body HIIT</div>
                        <div class="fit-w-desc">45 min • Advanced</div>
                        <div class="fit-w-btn" id="startBtn">Start</div>
                    </div>
                    <div class="fit-workout">
                        <div class="fit-w-title">Core Crusher</div>
                        <div class="fit-w-desc">20 min • Beginner</div>
                        <div class="fit-w-btn">Start</div>
                    </div>
                </div>
            </div>
        `
    };

    window.openModal = function(projectName) {
        if(modal && modalTitle && mobileFrame) {
            modalTitle.textContent = projectName;
            
            // Inject Mockup or Placeholder
            if (mockups[projectName]) {
                mobileFrame.innerHTML = mockups[projectName];
                runDemoAnimation(projectName);
            } else {
                mobileFrame.innerHTML = `<div class="video-placeholder">App Demo for ${projectName}</div>`;
            }

            modal.classList.add("active");
            lenis.stop(); // Stop smooth scrolling
        }
    };

    function runDemoAnimation(projectName) {
        if (demoTimeline) demoTimeline.kill(); // Kill any existing timeline
        
        const cursor = document.getElementById("demoCursor");
        const appScroll = document.getElementById("appScroll");
        
        demoTimeline = gsap.timeline({ delay: 1, repeat: -1, repeatDelay: 2 });

        if (projectName === "Urban Cafe") {
            const item = document.getElementById("cafeItem1");
            const btn = document.getElementById("addBtn");
            
            demoTimeline
                // Move cursor to first item
                .to(cursor, { opacity: 1, duration: 0.5 })
                .to(cursor, { top: "40%", left: "50%", duration: 1, ease: "power2.inOut" })
                // Scroll down
                .to(appScroll, { scrollTo: 100, duration: 1.5, ease: "power2.inOut" })
                // Move cursor to add button
                .to(cursor, { top: "52%", left: "80%", duration: 1, ease: "power2.inOut" })
                // Click
                .to(cursor, { scale: 0.8, backgroundColor: "rgba(255,255,255,0.8)", duration: 0.1 })
                .to(btn, { scale: 0.9, backgroundColor: "#fff", duration: 0.1 }, "<")
                .to(cursor, { scale: 1, backgroundColor: "rgba(255,255,255,0.4)", duration: 0.1 })
                .to(btn, { scale: 1, backgroundColor: "#cfa878", duration: 0.1 }, "<")
                // Success pop (change button text temporarily)
                .set(btn, { innerText: "✓", backgroundColor: "#34d399" })
                .to(cursor, { opacity: 0, duration: 0.5, delay: 0.5 })
                // Reset
                .set(btn, { innerText: "+", backgroundColor: "#cfa878" })
                .to(appScroll, { scrollTo: 0, duration: 0 });

        } else if (projectName === "FitBody App") {
            const startBtn = document.getElementById("startBtn");

            demoTimeline
                .to(cursor, { opacity: 1, duration: 0.5 })
                // Scroll down
                .to(appScroll, { scrollTo: 120, duration: 1.5, ease: "power2.inOut" })
                // Move cursor to start button
                .to(cursor, { top: "60%", left: "25%", duration: 1, ease: "power2.inOut" })
                // Click
                .to(cursor, { scale: 0.8, backgroundColor: "rgba(255,255,255,0.8)", duration: 0.1 })
                .to(startBtn, { scale: 0.9, duration: 0.1 }, "<")
                .to(cursor, { scale: 1, backgroundColor: "rgba(255,255,255,0.4)", duration: 0.1 })
                .to(startBtn, { scale: 1, duration: 0.1 }, "<")
                .set(startBtn, { innerText: "Started!", backgroundColor: "#f43f5e", color: "#fff" })
                .to(cursor, { opacity: 0, duration: 0.5, delay: 0.5 })
                // Reset
                .set(startBtn, { innerText: "Start", backgroundColor: "#34d399", color: "#000" })
                .to(appScroll, { scrollTo: 0, duration: 0 });
        }
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", () => {
            modal.classList.remove("active");
            if (demoTimeline) demoTimeline.kill();
            mobileFrame.innerHTML = ""; // Clear content
            lenis.start(); // Resume scrolling
        });
    }

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("active");
                if (demoTimeline) demoTimeline.kill();
                mobileFrame.innerHTML = "";
                lenis.start();
            }
        });
    }

})();
