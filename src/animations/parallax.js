import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // ═══════════════════════════════════════════════════════
  // 1. HERO — Scale down + fade au scroll (scrub)
  // ═══════════════════════════════════════════════════════
  const heroContainer = document.querySelector('.hero-container');
  if (heroContainer) {
    gsap.to(heroContainer, {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2
      },
      scale: 0.9,
      opacity: 0,
      y: '15%',
      ease: 'none'
    });
  }

  // ═══════════════════════════════════════════════════════
  // 2. IMAGES — Parallaxe interne (image bouge dans son cadre)
  // ═══════════════════════════════════════════════════════
  gsap.utils.toArray('.mission-media img, .mission-media video, .project-media img').forEach(img => {
    gsap.to(img, {
      scrollTrigger: {
        trigger: img.closest('.mission-card, .project-card'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: '-15%',
      ease: 'none'
    });
  });

  // ═══════════════════════════════════════════════════════
  // 3. BLOCS RÉFLEXION — Drift subtil alterné
  // ═══════════════════════════════════════════════════════
  gsap.utils.toArray('.reflexion-block').forEach((block, i) => {
    const direction = i % 2 === 0 ? 15 : -15;
    gsap.to(block, {
      scrollTrigger: {
        trigger: block,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      },
      y: direction,
      ease: 'none'
    });
  });
}
