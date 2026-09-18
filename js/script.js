document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
// HEADER — PILL GLISSANTE AU SURVOL
// =========================================================
    function initNavSlider() {
        const ul = document.querySelector('nav ul');
        if (!ul) return;

        const pill = ul;

        function movePillTo(el) {
            const ulRect  = ul.getBoundingClientRect();
            const elRect  = el.getBoundingClientRect();
            ul.style.setProperty('--pill-left',  (elRect.left  - ulRect.left)  + 'px');
            ul.style.setProperty('--pill-width', elRect.width + 'px');
            ul.classList.add('slider-ready');
        }

        // Positionne sur le lien actif au chargement
        const active = ul.querySelector('a.active');
        if (active) {
            setTimeout(() => movePillTo(active.parentElement), 100);
        }

        // Suit le survol
        ul.querySelectorAll('li').forEach(li => {
            li.addEventListener('mouseenter', () => movePillTo(li));
        });

        // Revient sur l'actif quand la souris quitte le nav
        ul.addEventListener('mouseleave', () => {
            const active = ul.querySelector('a.active');
            if (active) movePillTo(active.parentElement);
            else ul.classList.remove('slider-ready');
        });
    }

// Appelle initNavSlider() dans le DOMContentLoaded existant
// (ajoute cette ligne à la fin de ton DOMContentLoaded)
    initNavSlider();

    // =========================================================
    // 1. MENU BURGER
    // =========================================================
    const menuToggle = document.getElementById('menu-toggle');
    const header = document.getElementById('dynamic-header');

    if (menuToggle && header) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            header.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!header.contains(e.target)) header.classList.remove('active');
        });
    }

    // =========================================================
    // 2. FADE-UP INTERSECTION OBSERVER
    // =========================================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, {threshold: 0.1});

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    setTimeout(() => {
        document.querySelectorAll('.fade-up').forEach(el => el.classList.add('show'));
    }, 600);

    // =========================================================
    // 3. PARALLAXE SOURIS OPTIMISÉ (hero uniquement)
    // =========================================================
    if (window.innerWidth > 900) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let isParallaxTicking = false;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!isParallaxTicking) {
                requestAnimationFrame(updateParallax);
                isParallaxTicking = true;
            }
        });

        function updateParallax() {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;

            document.querySelectorAll('.js-mouse-parallax').forEach(el => {
                const speed = parseFloat(el.getAttribute('data-vitesse')) || 40;
                const mx = (cx - mouseX) / speed;
                const my = (cy - mouseY) / speed;

                if (el.classList.contains('decor-layer')) {
                    el.style.transform = `translate(calc(-50% + ${mx}px), calc(-50% + ${my}px))`;
                } else {
                    el.style.transform = `translate(${mx}px, ${my}px)`;
                }
            });
            isParallaxTicking = false;
        }
    }

    // =========================================================
    // 4. TYPED.JS — effet de frappe sur l'accueil
    // =========================================================
    const typedEl = document.getElementById('typed-target');
    if (typedEl && typeof Typed !== 'undefined') {
        new Typed('#typed-target', {
            strings: [
                'Développeur Java EE.',
                'Passionné d\'automatisation.',
                'Étudiant BUT2 RACA.',
                'Curieux & rigoureux.'
            ],
            typeSpeed: 55,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
        });
    }

    // =========================================================
    // 5. BARRES DE COMPÉTENCES (IntersectionObserver)
    // =========================================================
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.skill-fill').forEach(bar => {
                    bar.classList.add('animated');
                });
                // Met à jour le % affiché
                entry.target.querySelectorAll('.skill-pct').forEach(el => {
                    const pct = el.getAttribute('data-pct');
                    el.textContent = pct + '%';
                });
            }
        });
    }, {threshold: 0.2});

    document.querySelectorAll('.skills-category').forEach(el => skillObserver.observe(el));

    // =========================================================
    // 6. CHART.JS — Radar (compétences)
    // =========================================================
    const radarCtx = document.getElementById('radarChart');
    if (radarCtx && typeof Chart !== 'undefined') {
        Chart.defaults.color = '#555';
        new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: ['Java EE', 'JSF/PrimeFaces', 'HTML/CSS', 'SQL', 'PowerShell', 'Git'],
                datasets: [{
                    label: 'Niveau',
                    data: [78, 72, 85, 70, 80, 75],
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    borderColor: 'rgba(255,255,255,0.3)',
                    pointBackgroundColor: '#fff',
                    pointBorderColor: 'transparent',
                    pointRadius: 4,
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        min: 0, max: 100,
                        ticks: {display: false},
                        grid: {color: '#1e1e1e'},
                        angleLines: {color: '#1e1e1e'},
                        pointLabels: {
                            color: '#666',
                            font: {size: 11, family: 'Segoe UI'}
                        }
                    }
                },
                plugins: {
                    legend: {display: false},
                    tooltip: {
                        backgroundColor: '#111',
                        borderColor: '#2a2a2a',
                        borderWidth: 1,
                        titleColor: '#fff',
                        bodyColor: '#888',
                        callbacks: {
                            label: ctx => ` ${ctx.raw}%`
                        }
                    }
                }
            }
        });
    }

    // =========================================================
    // 7. CHART.JS — Doughnut (réflexion)
    // =========================================================
    const doughnutCtx = document.getElementById('doughnutChart');
    if (doughnutCtx && typeof Chart !== 'undefined') {
        new Chart(doughnutCtx, {
            type: 'doughnut',
            data: {
                labels: ['Développement', 'Déploiement', 'UI/UX', 'Sécurité PDF', 'Documentation'],
                datasets: [{
                    data: [40, 20, 20, 15, 5],
                    backgroundColor: ['#2a2a2a', '#1e1e1e', '#333', '#242424', '#1a1a1a'],
                    borderColor: ['#444', '#333', '#555', '#3a3a3a', '#2e2e2e'],
                    borderWidth: 1,
                    hoverBackgroundColor: ['#333', '#272727', '#444', '#2e2e2e', '#222'],
                }]
            },
            options: {
                responsive: true,
                cutout: '72%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#555',
                            padding: 14,
                            font: {size: 11},
                            boxWidth: 10,
                            usePointStyle: true,
                        }
                    },
                    tooltip: {
                        backgroundColor: '#111',
                        borderColor: '#2a2a2a',
                        borderWidth: 1,
                        titleColor: '#fff',
                        bodyColor: '#888',
                        callbacks: {
                            label: ctx => ` ${ctx.label} — ${ctx.raw}%`
                        }
                    }
                }
            }
        });
    }

    // =========================================================
    // 8. CHART.JS — Bar Chart (gantt stage, page expérience)
    // =========================================================
    const ganttCtx = document.getElementById('ganttChart');
    if (ganttCtx && typeof Chart !== 'undefined') {
        new Chart(ganttCtx, {
            type: 'bar',
            data: {
                labels: ['Semaine 1-2', 'Semaine 3-4', 'Semaine 5-6', 'Semaine 7-8', 'Semaine 9-10'],
                datasets: [
                    {
                        label: 'Refonte UI/UX',
                        data: [100, 80, 20, 10, 0],
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderColor: 'rgba(255,255,255,0.3)',
                        borderWidth: 1,
                        borderRadius: 4,
                    },
                    {
                        label: 'Signature PDF',
                        data: [0, 20, 100, 80, 20],
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderColor: 'rgba(255,255,255,0.15)',
                        borderWidth: 1,
                        borderRadius: 4,
                    },
                    {
                        label: 'Déploiement & Debug',
                        data: [20, 30, 40, 80, 100],
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        borderRadius: 4,
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        grid: {color: '#1a1a1a'},
                        ticks: {color: '#555', font: {size: 11}}
                    },
                    y: {
                        grid: {color: '#1a1a1a'},
                        ticks: {color: '#555', font: {size: 11}, callback: v => v + '%'},
                        min: 0, max: 100,
                    }
                },
                plugins: {
                    legend: {
                        labels: {color: '#555', font: {size: 11}, boxWidth: 10, usePointStyle: true}
                    },
                    tooltip: {
                        backgroundColor: '#111',
                        borderColor: '#2a2a2a',
                        borderWidth: 1,
                        titleColor: '#fff',
                        bodyColor: '#888',
                        callbacks: {label: ctx => ` ${ctx.dataset.label} — ${ctx.raw}%`}
                    }
                }
            }
        });
    }

    // =========================================================
    // 9. DATATABLES — Tableau références
    // =========================================================
    const refTable = document.getElementById('ref-table');
    if (refTable && typeof $ !== 'undefined' && $.fn.DataTable) {
        $(refTable).DataTable({
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/fr-FR.json'
            },
            pageLength: 5,
            dom: '<"dt-top"lf>rt<"dt-bottom"ip>',
            order: [[0, 'asc']],
        });
    }

    // =========================================================
    // 10. FORMULAIRE CONTACT — EmailJS
    // =========================================================
    const form = document.getElementById('contact-form');
    if (form && typeof emailjs !== 'undefined') {
        emailjs.init('YOUR_PUBLIC_KEY'); // ← remplace

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('.btn-submit');
            const feedback = document.getElementById('form-feedback');

            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi...';

            try {
                await emailjs.send('SERVICE_ID', 'TEMPLATE_ID', {
                    from_name: form.querySelector('#nom').value,
                    from_email: form.querySelector('#email').value,
                    sujet: form.querySelector('#sujet')?.value || '',
                    message: form.querySelector('#message').value,
                });
                feedback.className = 'form-feedback success';
                feedback.textContent = '✓ Message envoyé ! Je vous réponds sous 48h.';
                form.reset();
            } catch {
                feedback.className = 'form-feedback error';
                feedback.textContent = '✗ Erreur lors de l\'envoi. Réessayez ou écrivez-moi directement.';
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> ENVOYER';
            }
        });
    }

    // =========================================================
    // 11. ÉCLAIRS ANIMÉS OPTIMISÉS (Moins de calculs, pas de blur)
    // =========================================================
    const canvas = document.getElementById('lightning-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        function randBetween(a, b) {
            return a + Math.random() * (b - a);
        }

        function drawBolt(ctx, x1, y1, x2, y2, roughness, depth, alpha, color) {
            if (depth === 0 || Math.abs(y2 - y1) < 4) {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = color;
                ctx.globalAlpha = alpha;
                ctx.lineWidth = depth === 0 ? 0.5 : 1.2;
                ctx.stroke();
                return;
            }
            const mx = (x1 + x2) / 2 + randBetween(-roughness, roughness);
            const my = (y1 + y2) / 2 + randBetween(-roughness / 4, roughness / 4);
            drawBolt(ctx, x1, y1, mx, my, roughness * 0.6, depth - 1, alpha, color);
            drawBolt(ctx, mx, my, x2, y2, roughness * 0.6, depth - 1, alpha, color);
            if (depth > 2 && Math.random() < 0.4) {
                drawBolt(ctx, mx, my,
                    mx + randBetween(-80, 80),
                    my + randBetween(40, 120),
                    roughness * 0.4, depth - 2, alpha * 0.5, color);
            }
        }

        const bolts = [];
        let frame = 0, nextBolt = 0;

        window.lightningEnabled = localStorage.getItem('portfolio-lightning') !== 'false';

        window.toggleLightning = function (state) {
            window.lightningEnabled = state;
            localStorage.setItem('portfolio-lightning', state);
            if (!state) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                bolts.length = 0;
            }
        };

        function spawnBolt() {
            const w = canvas.width, h = canvas.height;
            const type = Math.random();
            let x1, y1, x2, y2;
            if (type < 0.5) {
                x1 = randBetween(w * 0.1, w * 0.9);
                y1 = 0;
                x2 = x1 + randBetween(-120, 120);
                y2 = h;
            } else if (type < 0.75) {
                x1 = 0;
                y1 = randBetween(h * 0.05, h * 0.95);
                x2 = w;
                y2 = y1 + randBetween(-80, 80);
            } else {
                x1 = w;
                y1 = randBetween(h * 0.05, h * 0.95);
                x2 = 0;
                y2 = y1 + randBetween(-80, 80);
            }
            bolts.push({
                x1, y1, x2, y2,
                color: Math.random() < 0.5 ? '#ffffff' : '#222222',
                rough: randBetween(60, 140),
                depth: Math.floor(randBetween(4, 6)), // Optimisé ici
                life: 0,
                maxLife: Math.floor(randBetween(8, 18)),
                glow: Math.random() < 0.5,
            });
        }

        function loop() {
            requestAnimationFrame(loop);

            if (!window.lightningEnabled) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frame++;
            if (frame >= nextBolt) {
                spawnBolt();
                nextBolt = frame + Math.floor(randBetween(12, 35));
            }
            for (let i = bolts.length - 1; i >= 0; i--) {
                const b = bolts[i];
                b.life++;
                const p = b.life / b.maxLife;
                let alpha = p < 0.15 ? p / 0.15 : p < 0.4 ? 1 : 1 - (p - 0.4) / 0.6;
                alpha = Math.max(0, Math.min(1, alpha));

                if (b.glow && b.life <= 2) {
                    ctx.save();
                    ctx.globalAlpha = alpha * 0.05; // Réduit l'impact du flash
                    ctx.fillStyle = b.color === '#ffffff' ? '#ffffff' : '#000000';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.restore();
                }

                ctx.save();
                drawBolt(ctx, b.x1, b.y1, b.x2, b.y2, b.rough, b.depth, alpha * 0.95, b.color);

                if (b.color === '#ffffff') {
                    drawBolt(ctx, b.x1, b.y1, b.x2, b.y2, b.rough * 0.8, b.depth, alpha * 0.4, '#ffffff');
                }
                ctx.restore();
                if (b.life >= b.maxLife) bolts.splice(i, 1);
            }
        }

        loop();
    }

    // =========================================================
    // 12. CURSEUR PERSONNALISÉ OPTIMISÉ
    // =========================================================
    const cursor = document.getElementById('custom-cursor');

    if (cursor) {
        let cursorX = 0;
        let cursorY = 0;
        let isCursorTicking = false;

        document.addEventListener('mousemove', (e) => {
            if (!document.body.classList.contains('custom-cursor-active')) return;

            cursorX = e.clientX;
            cursorY = e.clientY;

            if (!isCursorTicking) {
                requestAnimationFrame(() => {
                    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
                    isCursorTicking = false;
                });
                isCursorTicking = true;
            }
        });

        document.addEventListener('mouseover', (e) => {
            if (!document.body.classList.contains('custom-cursor-active')) return;

            const isHovering = e.target.closest('a, button, input, textarea, .theme-swatch, #theme-menu-btn');
            if (isHovering) {
                cursor.classList.add('is-hovering');
            } else {
                cursor.classList.remove('is-hovering');
            }
        });
    }

});

