import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

let textRevealInitialized = false;

export function initTextReveal() {
  if (
    textRevealInitialized
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }
  textRevealInitialized = true;

  // Utilitaire : envelopper chaque ligne dans un masque overflow:hidden
  const wrapLines = (splitInstance) => {
    if (!splitInstance.lines) return;
    splitInstance.lines.forEach(line => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('line-mask');
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });
  };

  // ═══════════════════════════════════════════════════════
  // 1. HERO — Séquence d'introduction cinématographique
  // ═══════════════════════════════════════════════════════
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    // Le contenu du hero est préparé avant la levée du loader.
    // Il ne doit pas réapparaître une seconde fois après le rendu 3D.
    const heroBackground = document.querySelector('.hero-bg');
    if (heroBackground) {
      gsap.set(heroBackground, {
        clearProps: 'opacity,transform,filter'
      });
    }

    const split = new SplitType(heroTitle, { types: 'lines, chars' });
    wrapLines(split);

    // Le loader assure déjà la transition d'entrée.
    // On stabilise donc tous les éléments du hero en une seule passe.
    gsap.set(split.chars, {
      opacity: 1,
      clearProps: 'transform'
    });
    gsap.set('.hero-subtitle', {
      opacity: 1,
      y: 0,
      clearProps: 'transform'
    });
    gsap.set('.hero-quote', {
      opacity: 0.5,
      y: 0,
      clearProps: 'transform'
    });
    gsap.set('.hero-cta', {
      opacity: 1,
      y: 0,
      scale: 1,
      clearProps: 'transform'
    });
    gsap.set('.hero-scroll-indicator', {
      opacity: 1
    });
  }

  // ═══════════════════════════════════════════════════════
  // 2. TITRES DE SECTION — Reveal par mots depuis le masque
  // ═══════════════════════════════════════════════════════
  gsap.utils.toArray('.section-title').forEach(title => {
    const split = new SplitType(title, { types: 'lines, words' });
    wrapLines(split);

    gsap.from(split.words, {
      scrollTrigger: { trigger: title, start: 'top 85%', toggleActions: 'play none none none' },
      y: '100%',
      opacity: 0,
      duration: 1.2,
      stagger: 0.04,
      ease: 'expo.out'
    });
  });

  // ═══════════════════════════════════════════════════════
  // 3. PARAGRAPHES — Reveal ligne par ligne
  // ═══════════════════════════════════════════════════════
  gsap.utils.toArray('.about-section p, .reflexion-block p').forEach(p => {
    const split = new SplitType(p, { types: 'lines' });
    wrapLines(split);

    gsap.from(split.lines, {
      scrollTrigger: { trigger: p, start: 'top 92%', toggleActions: 'play none none none' },
      y: '100%',
      opacity: 0,
      duration: 0.9,
      stagger: 0.06,
      ease: 'power3.out'
    });
  });

  // ═══════════════════════════════════════════════════════
  // 4. SOUS-TITRES — Reveal simple
  // ═══════════════════════════════════════════════════════
  gsap.utils.toArray('.about-section h3, .reflexion-block h3').forEach(h3 => {
    gsap.from(h3, {
      scrollTrigger: { trigger: h3, start: 'top 90%', toggleActions: 'play none none none' },
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  });
}
