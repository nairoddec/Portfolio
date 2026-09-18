import gsap from 'gsap';

export function initHoverEffects() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  // ═══════════════════════════════════════════════════════
  // 1. BOUTONS MAGNÉTIQUES
  // ═══════════════════════════════════════════════════════
  gsap.utils.toArray('.hero-cta, .nav-cta, .btn-submit').forEach(btn => {
    const handleMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.25,
        y: y * 0.25,
        duration: 0.4,
        ease: 'power2.out'
      });
    };

    const handleLeave = () => {
      gsap.to(btn, {
        x: 0, y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.4)'
      });
    };

    btn.addEventListener('mousemove', handleMove);
    btn.addEventListener('mouseleave', handleLeave);
  });

  // ═══════════════════════════════════════════════════════
  // 2. FLÈCHES SOCIALES
  // ═══════════════════════════════════════════════════════
  gsap.utils.toArray('.social-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      const arrow = link.querySelector('.social-arrow');
      if (arrow) gsap.to(arrow, { x: 4, y: -4, duration: 0.3, ease: 'power2.out' });
    });
    link.addEventListener('mouseleave', () => {
      const arrow = link.querySelector('.social-arrow');
      if (arrow) gsap.to(arrow, { x: 0, y: 0, duration: 0.4, ease: 'power2.out' });
    });
  });
}
