import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initMarquee() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const marquees = document.querySelectorAll('.marquee-container');
  
  marquees.forEach((container) => {
    const track = container.querySelector('.marquee-track');
    if (!track) return;

    // Cloner le contenu pour avoir un effet infini sans coupure
    track.innerHTML += track.innerHTML;

    // Animation de défilement infinie
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(track, {
      xPercent: -50, // Décale de 50% car on a cloné le contenu
      ease: 'none',
      duration: 20 // Vitesse de base
    });

    // Lier la vitesse du marquee à la vitesse de scroll (Scrubbing effect)
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
          // Plus on scrolle vite, plus le timeScale augmente (vitesse de l'animation)
          const velocity = Math.abs(self.getVelocity());
          // Limiter le boost pour ne pas que ce soit illisible
          const speedBoost = Math.max(1, velocity / 100); 
          
          gsap.to(tl, {
              timeScale: self.direction === 1 ? speedBoost : -speedBoost,
              duration: 0.3,
              overwrite: true
          });
          
          // Revenir à vitesse normale (timeScale 1) après le scroll
          gsap.to(tl, {
              timeScale: self.direction === 1 ? 1 : -1,
              duration: 1.5,
              delay: 0.1,
              ease: "power2.out",
              overwrite: "auto"
          });
      }
    });
  });
}
