/* ============================================
   PORTFOLIO — script.js
   Mihir Katariya — Flutter Developer
   ============================================ */

(function () {
    'use strict';

    // ——————————————————————————————————————————
    // 1. CURSOR GLOW (Smooth Premium)
    // ——————————————————————————————————————————
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        if (cursorGlow) {
            cursorX += (mouseX - cursorX) * 0.15; // Smooth trailing effect
            cursorY += (mouseY - cursorY) * 0.15;
            cursorGlow.style.left = cursorX + 'px';
            cursorGlow.style.top = cursorY + 'px';
        }
        requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);

    // Interactive cursor scaling
    const interactives = document.querySelectorAll('a, button, .skill-card, .project-card, .education-card, .timeline-content, .contact-item');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorGlow) cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            if (cursorGlow) cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // ——————————————————————————————————————————
    // 2. HERO PARTICLE CANVAS
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
                // Cyan or purple hue
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
    // 3. TYPEWRITER EFFECT
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
    // 4. NAVBAR — scroll state & active link
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

    // ——————————————————————————————————————————
    // 5. MOBILE NAV TOGGLE
    // ——————————————————————————————————————————
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });

        // Close menu on link click
        navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
            });
        });
    }

    // ——————————————————————————————————————————
    // 6. SCROLL-TRIGGERED ANIMATIONS
    // ——————————————————————————————————————————
    const animElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animElements.forEach(el => observer.observe(el));

    // ——————————————————————————————————————————
    // 7. SKILL BAR FILL ANIMATION
    // ——————————————————————————————————————————
    const skillFills = document.querySelectorAll('.skill-fill');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const level = entry.target.dataset.level || 50;
                entry.target.style.width = level + '%';
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillFills.forEach(bar => skillObserver.observe(bar));

    // ——————————————————————————————————————————
    // 8. STAT COUNTER ANIMATION
    // ——————————————————————————————————————————
    const statNumbers = document.querySelectorAll('.stat-number');

    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCount(entry.target, 0, target, 1500);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => statObserver.observe(num));

    function animateCount(el, start, end, duration) {
        let startTime = null;
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.floor(eased * (end - start) + start);
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }

    // ——————————————————————————————————————————
    // 9. CONTACT FORM (client-side only)
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

    // ——————————————————————————————————————————
    // 10. SMOOTH ANCHOR SCROLL (fallback)
    // ——————————————————————————————————————————
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

})();
