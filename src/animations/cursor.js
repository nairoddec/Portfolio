import gsap from 'gsap';

export function initCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  // Création du curseur
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  const cursorText = document.createElement('span');
  cursorText.classList.add('cursor-text');
  cursor.appendChild(cursorText);
  document.body.appendChild(cursor);

  // Positionnement fluide via GSAP quickTo
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });

  window.addEventListener('mousemove', (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });

  // Hover contextuel (data-cursor)
  document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const label = el.getAttribute('data-cursor');

      if (label) {
        cursorText.textContent = label;
        gsap.to(cursor, {
          scale: 3,
          backgroundColor: 'var(--color-accent)',
          duration: 0.4,
          ease: 'back.out(1.4)'
        });
        gsap.to(cursorText, { opacity: 1, duration: 0.2, delay: 0.1 });
      } else {
        gsap.to(cursor, {
          scale: 2,
          backgroundColor: 'rgba(255,40,0,0.1)',
          border: '1px solid rgba(255,40,0,0.5)',
          duration: 0.3
        });
      }
    });

    el.addEventListener('mouseleave', () => {
      cursorText.textContent = '';
      gsap.to(cursorText, { opacity: 0, duration: 0.1 });
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: 'var(--color-accent)',
        border: 'none',
        duration: 0.4,
        ease: 'power3.out'
      });
    });
  });

  // Masquer le curseur système
  document.documentElement.style.cursor = 'none';
  document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
    el.style.cursor = 'none';
  });
}
