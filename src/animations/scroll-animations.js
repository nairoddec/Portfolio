import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // 1. Fade-up génériques
  // Les éléments du hero sont préparés par initTextReveal avant la levée
  // du loader. Les rejouer ici provoquerait une seconde apparition.
  gsap.utils.toArray(
    '.fade-up:not(.hero-quote):not(.hero-cta):not(.section-header):not(.profile-card):not(.stat-grid)',
  ).forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'expo.out'
    });
  });

  // 2. Section labels — slide depuis la gauche
  gsap.utils.toArray('.section-label').forEach(label => {
    gsap.from(label, {
      scrollTrigger: { trigger: label, start: 'top 90%', toggleActions: 'play none none none' },
      x: -40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  });

  // 3. Section descriptions
  gsap.utils.toArray('.section-description').forEach(desc => {
    gsap.from(desc, {
      scrollTrigger: { trigger: desc, start: 'top 90%', toggleActions: 'play none none none' },
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.2
    });
  });

  // 4. Compteurs statistiques
  gsap.utils.toArray('.stat-number').forEach(stat => {
    const val = stat.getAttribute('data-value');
    if (!isNaN(val)) {
      const target = { val: 0 };
      gsap.to(target, {
        scrollTrigger: { trigger: stat, start: 'top 90%', toggleActions: 'play none none none' },
        val: parseFloat(val),
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => { stat.textContent = Math.round(target.val); }
      });
    }
  });

  // 5. Barres de compétences
  gsap.utils.toArray('.skill-fill').forEach(fill => {
    const w = getComputedStyle(fill).getPropertyValue('--fill');
    gsap.to(fill, {
      scrollTrigger: { trigger: fill.closest('.skill-card'), start: 'top 85%', toggleActions: 'play none none none' },
      width: w,
      duration: 1.5,
      ease: 'expo.out'
    });
  });

  // 6. Blocs de réflexion — stagger avec scale
  gsap.utils.toArray('.reflection-main').forEach(grid => {
    const blocks = grid.querySelectorAll('.reflexion-block');
    gsap.from(blocks, {
      scrollTrigger: { trigger: grid, start: 'top 85%', toggleActions: 'play none none none' },
      y: 50,
      opacity: 0,
      scale: 0.96,
      duration: 1,
      stagger: 0.15,
      ease: 'expo.out'
    });
  });

}
