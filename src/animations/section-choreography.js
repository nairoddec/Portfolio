import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let choreographyInitialized = false;

const reveal = (target, from, to, options = {}) => {
  if (!target) return;

  gsap.fromTo(target, from, {
    ...to,
    scrollTrigger: {
      trigger: target,
      start: options.start || 'top 82%',
      once: true,
      invalidateOnRefresh: true,
    },
  });
};

export function initSectionChoreography() {
  if (
    choreographyInitialized
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  choreographyInitialized = true;

  const sections = [
    '#about',
    '#skills',
    '#experience',
    '#projects',
    '#reflection',
    '#contact',
  ];

  document.querySelectorAll('.section-header').forEach((header, index) => {
    const section = header.closest('section');
    if (!section || !sections.includes(`#${section.id}`)) return;

    header.dataset.sectionIndex = String(index + 1).padStart(2, '0');
    header.classList.add('editorial-reveal');

    reveal(
      header.querySelector('.section-label'),
      { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
      { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.1, ease: 'expo.out' },
      { start: 'top 88%' },
    );

    reveal(
      header.querySelector('.section-description'),
      { x: 28, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, delay: 0.12, ease: 'power3.out' },
      { start: 'top 86%' },
    );
  });

  document.querySelectorAll('#about .about-section').forEach((block, index) => {
    block.classList.add('editorial-reveal');
    reveal(
      block,
      { x: index % 2 === 0 ? -34 : 34, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.1, ease: 'expo.out' },
    );
  });

  reveal(
    document.querySelector('#about .profile-card'),
    { x: 30, opacity: 0 },
    { x: 0, opacity: 1, duration: 1, ease: 'expo.out' },
  );

  document.querySelectorAll('#about .stat-card').forEach((card, index) => {
    reveal(
      card,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: index * 0.06, ease: 'power3.out' },
    );
  });

  document.querySelectorAll('#skills .skills-category').forEach(category => {
    reveal(
      category.querySelector('.category-title'),
      { x: -24, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
    );

    category.querySelectorAll('.skill-card').forEach((card, index) => {
      card.classList.add('editorial-reveal');
      reveal(
        card,
        { clipPath: 'inset(0 0 100% 0)', opacity: 0, y: 18 },
        {
          clipPath: 'inset(0 0 0% 0)',
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: index * 0.045,
          ease: 'expo.out',
        },
      );
    });
  });

  document.querySelectorAll('#experience .mission-card').forEach((card, index) => {
    card.classList.add('editorial-reveal');
    reveal(
      card,
      { y: 42, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
      {
        y: 0,
        opacity: 1,
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.15,
        delay: index * 0.12,
        ease: 'expo.out',
      },
    );
  });

  document.querySelectorAll('#projects .project-card').forEach((card, index) => {
    card.classList.add('editorial-reveal');
    reveal(
      card,
      { x: index % 2 === 0 ? -32 : 32, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
      {
        x: 0,
        opacity: 1,
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.1,
        delay: index * 0.1,
        ease: 'expo.out',
      },
    );
  });

  document.querySelectorAll('#contact .form-group').forEach((field, index) => {
    reveal(
      field,
      { x: -24, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, delay: index * 0.08, ease: 'power3.out' },
    );
  });

  reveal(
    document.querySelector('#contact .btn-submit'),
    { x: -24, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
  );

  reveal(
    document.querySelector('#contact .contact-sidebar'),
    { x: 30, opacity: 0 },
    { x: 0, opacity: 1, duration: 1, ease: 'expo.out' },
  );
}
