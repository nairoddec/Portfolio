// ============================================================
//  1. CERVEAU : THÈMES ET SAUVEGARDES GLOBALES
// ============================================================
const THEME_PRESETS = {
    dark:   { bg:'#080808', bg2:'#111111', text:'#ffffff', muted:'#888888', border:'#2a2a2a', accent:'#ffffff' },
    light:  { bg:'#f5f5f5', bg2:'#ebebeb', text:'#111111', muted:'#555555', border:'#cccccc', accent:'#111111' },
    blue:   { bg:'#0d1117', bg2:'#161b22', text:'#e6edf3', muted:'#7d8590', border:'#1e3a5f', accent:'#60a5fa' },
    green:  { bg:'#0a120e', bg2:'#0f1d14', text:'#d1fae5', muted:'#6b9e80', border:'#1a3d2b', accent:'#34d399' },
    purple: { bg:'#0e0a1a', bg2:'#150f26', text:'#ede9fe', muted:'#7c6fa0', border:'#3b2a6b', accent:'#a78bfa' },
    rose:   { bg:'#1c0f13', bg2:'#2d151e', text:'#fce7f3', muted:'#a97e8e', border:'#5c2b3e', accent:'#f472b6' },
    sunset: { bg:'#1a100c', bg2:'#2a1811', text:'#ffedd5', muted:'#a37c6d', border:'#5c3321', accent:'#fb923c' },
    sepia:  { bg:'#f4ecd8', bg2:'#e8dcc4', text:'#433422', muted:'#8a7861', border:'#d1c0a5', accent:'#b45309' }
};

window.applyGlobalTheme = function(themeName) {
    const t = THEME_PRESETS[themeName];
    if (!t) return;
    const root = document.documentElement;

    // Variables du thème
    root.style.setProperty('--theme-bg', t.bg);
    root.style.setProperty('--theme-bg2', t.bg2);
    root.style.setProperty('--theme-text', t.text);
    root.style.setProperty('--theme-muted', t.muted);
    root.style.setProperty('--theme-border', t.border);
    root.style.setProperty('--theme-accent', t.accent);

    // Synchronisation avec ton ancien CSS
    root.style.setProperty('--bg-color', t.bg);
    root.style.setProperty('--text-main', t.text);
    root.style.setProperty('--text-muted', t.muted);
    root.style.setProperty('--box-bg', t.bg2);
    root.style.setProperty('--accent-color', t.accent);

    localStorage.setItem('portfolio-theme', themeName);
};

// Application au démarrage
applyGlobalTheme(localStorage.getItem('portfolio-theme') || 'dark');

// --- MOTEUR AUDIO POUR LES BOUTONS ---
window.playClickSound = function() {
    if (localStorage.getItem('portfolio-sound') !== 'true') return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.05);
        osc.stop(ctx.currentTime + 0.05);
    } catch(e) {}
};


// ============================================================
//  2. COMPOSANT : <site-head>
// ============================================================
class SiteHead extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title') || 'Portfolio | Dorian Decitre';
        document.title = title;

        document.head.insertAdjacentHTML('beforeend', `
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="css/style.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
            <link rel="stylesheet" href="https://unpkg.com/aos@2.3.4/dist/aos.css">
            <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css">
        `);

        const scripts = [
            'https://unpkg.com/aos@2.3.4/dist/aos.js',
            'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
            'https://code.jquery.com/jquery-3.7.1.min.js',
            'https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js',
            'https://unpkg.com/typed.js@2.1.0/dist/typed.umd.js',
            'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js',
            'js/script.js',
        ];

        scripts.forEach(src => {
            const s = document.createElement('script');
            s.src = src;
            s.async = false;
            document.head.appendChild(s);
        });

        this.remove();
    }
}


// ============================================================
//  3. COMPOSANT : <site-header>
// ============================================================
class SiteHeader extends HTMLElement {
    connectedCallback() {
        const current = this.getAttribute('page') || '';
        const links = [
            { id: 'index',       href: 'index.html',       label: 'Accueil'      },
            { id: 'a-propos',    href: 'a-propos.html',    label: 'À propos'     },
            { id: 'competences', href: 'competences.html', label: 'Compétences'  },
            { id: 'experience',  href: 'experience.html',  label: 'Expérience'   },
            { id: 'reflexion',   href: 'reflexion.html',   label: 'Réflexion'    },
            { id: 'references',  href: 'references.html',  label: 'Références'   },
            { id: 'contact',     href: 'contact.html',     label: 'Contact'      },
        ];

        const lis = links.map(l => `
            <li><a href="${l.href}" ${l.id === current ? 'class="active"' : ''}>${l.label}</a></li>
        `).join('');

        this.outerHTML = `
            <header id="dynamic-header" class="fade-up show">
                <nav>
                    <button class="menu-burger" id="menu-toggle" aria-label="Menu">
                        <span class="barre"></span><span class="barre"></span><span class="barre"></span>
                    </button>
                    <ul id="nav-links">${lis}</ul>
                </nav>
            </header>
        `;
    }
}


// ============================================================
//  4. COMPOSANT : <site-footer>
// ============================================================
class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="site-footer fade-up">
                <div class="footer-content">
                    <div class="footer-logo">
                        <h3>Dorian Decitre</h3>
                        <p>Étudiant BUT2 RACA Informatique</p>
                    </div>
                    <div class="footer-social">
                        <h4>Réseaux</h4>
                        <div class="social-icons">
                            <a href="https://github.com/nairoddec" target="_blank" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
                            <a href="https://www.linkedin.com/in/dorian-decitre/" target="_blank" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                            <a href="mailto:contact@doriandecitre.fr" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2026 Dorian Decitre. Tous droits réservés.</p>
                </div>
            </footer>
        `;
    }
}


// ============================================================
//  5. COMPOSANT : <theme-switcher>
// ============================================================
class ThemeSwitcher extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="theme-switcher-container">
                <button id="theme-menu-btn" title="Centre de contrôle" aria-label="Thèmes">
                    <i class="fa-solid fa-sliders"></i>
                </button>
                <div id="theme-dropdown">
                    <p class="theme-title">Couleurs</p>
                    <div class="theme-grid">
                        <button class="theme-swatch" data-theme="dark" title="Sombre" style="--swatch-accent: #ffffff; background: #080808;"></button>
                        <button class="theme-swatch" data-theme="light" title="Clair" style="--swatch-accent: #111111; background: #f5f5f5;"></button>
                        <button class="theme-swatch" data-theme="blue" title="Bleu" style="--swatch-accent: #60a5fa; background: #0d1117;"></button>
                        <button class="theme-swatch" data-theme="green" title="Forêt" style="--swatch-accent: #34d399; background: #0a120e;"></button>
                        <button class="theme-swatch" data-theme="purple" title="Violet" style="--swatch-accent: #a78bfa; background: #0e0a1a;"></button>
                        <button class="theme-swatch" data-theme="rose" title="Rose" style="--swatch-accent: #f472b6; background: #1c0f13;"></button>
                        <button class="theme-swatch" data-theme="sunset" title="Coucher de soleil" style="--swatch-accent: #fb923c; background: #1a100c;"></button>
                        <button class="theme-swatch" data-theme="sepia" title="Sépia" style="--swatch-accent: #b45309; background: #f4ecd8;"></button>
                    </div>

                    <div class="theme-divider"></div>
                    <p class="theme-title">Typographie</p>
                    <div class="option-row">
                        <button class="opt-btn" data-opt="font" data-val="modern">Moderne</button>
                        <button class="opt-btn" data-opt="font" data-val="serif">Élégant</button>
                        <button class="opt-btn" data-opt="font" data-val="mono">Codeur</button>
                        <button class="opt-btn" data-opt="font" data-val="dyslexic">Dyslexie</button>
                    </div>

                    <div class="theme-divider"></div>
                    <p class="theme-title">Densité Visuelle</p>
                    <div class="option-row">
                        <button class="opt-btn" data-opt="density" data-val="airy">Aéré</button>
                        <button class="opt-btn" data-opt="density" data-val="compact">Compact</button>
                    </div>

                    <div class="theme-divider"></div>
                    <p class="theme-title">Style & Bordures</p>
                    <div class="option-row">
                        <button class="opt-btn" data-opt="radius" data-val="round">Arrondi</button>
                        <button class="opt-btn" data-opt="radius" data-val="sharp">Strict</button>
                    </div>
                    <div class="option-row">
                        <button class="opt-btn" data-opt="glow" data-val="discret">Discret</button>
                        <button class="opt-btn" data-opt="glow" data-val="neon">Néon</button>
                    </div>

                    <div class="theme-divider"></div>
                    <p class="theme-title">Système & Effets</p>
                    <button id="contrast-toggle-btn" class="toggle-line">👓 Contraste Élevé : <strong>OFF</strong></button>
                    <button id="eco-toggle-btn" class="toggle-line">🌱 Mode Éco : <strong>OFF</strong></button>
                    <button id="sound-toggle-btn" class="toggle-line">🔊 Sons UI : <strong>OFF</strong></button>
                    <button id="lightning-toggle-btn" class="toggle-line">⚡ Éclairs : <strong>ON</strong></button>
                    <button id="anim-toggle-btn" class="toggle-line">✨ Anims : <strong>ON</strong></button>
                    <button id="cursor-toggle-btn" class="toggle-line">🖱️ Curseur : <strong>OFF</strong></button>
                </div>
            </div>
            <div id="custom-cursor"></div>
        `;

        setTimeout(() => {
            const btn = document.getElementById('theme-menu-btn');
            const dropdown = document.getElementById('theme-dropdown');
            const root = document.documentElement;

            // --- Menu Toggle ---
            btn.onclick = (e) => {
                e.stopPropagation();
                window.playClickSound();
                dropdown.classList.toggle('show');
            };
            document.onclick = (e) => { if (!this.contains(e.target)) dropdown.classList.remove('show'); };

            // --- Logique de sélection UI ---
            const updateUI = (category, value) => {
                document.querySelectorAll(`.opt-btn[data-opt="${category}"]`).forEach(b => {
                    b.classList.toggle('active', b.getAttribute('data-val') === value);
                });
            };

            // --- Logique des Couleurs ---
            document.querySelectorAll('.theme-swatch').forEach(s => {
                s.onclick = () => {
                    window.playClickSound();
                    if (window.applyGlobalTheme) {
                        window.applyGlobalTheme(s.dataset.theme);
                        document.querySelectorAll('.theme-swatch').forEach(sw => sw.classList.remove('active'));
                        s.classList.add('active');
                    }
                };
            });

            // --- Logique Groupes de Boutons (Font, Radius, Density, Glow) ---
            document.querySelectorAll('.opt-btn').forEach(b => {
                b.onclick = () => {
                    window.playClickSound();
                    const opt = b.dataset.opt;
                    const val = b.dataset.val;
                    root.setAttribute(`data-${opt}`, val);
                    localStorage.setItem(`portfolio-${opt}`, val);
                    updateUI(opt, val);
                };
            });

            // --- Toggles (On/Off) ---
            const setupToggle = (id, storageKey, defaultValue, callback) => {
                const el = document.getElementById(id);
                if (!el) return;

                const storedValue = localStorage.getItem(storageKey);
                let state = storedValue !== null ? storedValue === 'true' : defaultValue === 'ON';

                const refresh = () => {
                    el.querySelector('strong').textContent = state ? 'ON' : 'OFF';
                    el.style.opacity = state ? '1' : '0.5';
                    callback(state);
                };

                el.onclick = () => {
                    window.playClickSound();
                    state = !state;
                    localStorage.setItem(storageKey, state);
                    refresh();
                };

                refresh();
            };

            // Anciens toggles
            setupToggle('lightning-toggle-btn', 'portfolio-lightning', 'ON', (s) => {
                if (window.toggleLightning) window.toggleLightning(s);
            });
            setupToggle('cursor-toggle-btn', 'portfolio-cursor', 'OFF', (s) => {
                document.body.classList.toggle('custom-cursor-active', s);
            });
            setupToggle('anim-toggle-btn', 'portfolio-anim', 'ON', (s) => {
                root.setAttribute('data-anims', s ? 'on' : 'off');
            });

            // Nouveaux toggles
            setupToggle('eco-toggle-btn', 'portfolio-eco', 'OFF', (s) => root.setAttribute('data-eco', s ? 'on' : 'off'));
            setupToggle('contrast-toggle-btn', 'portfolio-contrast', 'OFF', (s) => root.setAttribute('data-contrast', s ? 'high' : 'normal'));
            setupToggle('sound-toggle-btn', 'portfolio-sound', 'OFF', () => {}); // La logique est dans window.playClickSound

            // --- Restauration globale ---
            ['font', 'radius', 'density', 'glow'].forEach(opt => {
                // Valeurs par défaut si rien n'est sauvegardé
                let defaultVal = 'modern';
                if(opt === 'radius') defaultVal = 'round';
                if(opt === 'density') defaultVal = 'airy';
                if(opt === 'glow') defaultVal = 'discret';

                const val = localStorage.getItem(`portfolio-${opt}`) || defaultVal;
                root.setAttribute(`data-${opt}`, val);
                updateUI(opt, val);
            });

            const currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
            document.querySelector(`.theme-swatch[data-theme="${currentTheme}"]`)?.classList.add('active');

        }, 0);
    }
}

// ============================================================
//  6. ENREGISTREMENT DES COMPOSANTS
// ============================================================
customElements.define('site-head',    SiteHead);
customElements.define('site-header',  SiteHeader);
customElements.define('site-footer',  SiteFooter);
customElements.define('theme-switcher', ThemeSwitcher);