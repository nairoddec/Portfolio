export function initNavigation() {
  const nav = document.getElementById('main-nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
  const sections = document.querySelectorAll('section[id]');
  
  if (!nav) return;

  // 1. Détection du scroll pour le style de la navbar
  const handleScroll = () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Check initial

  // 2. Menu Mobile (Hamburger)
  if (hamburger && mobileMenu) {
    const toggleMenu = () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    };

    hamburger.addEventListener('click', toggleMenu);

    // Fermer le menu au clic sur un lien mobile
    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('open')) {
          toggleMenu();
        }
      });
    });
  }

  // 3. Scroll Spy avec IntersectionObserver
  const spyOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const spyCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Mettre à jour les liens de navigation (desktop et mobile)
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === id) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  const spyObserver = new IntersectionObserver(spyCallback, spyOptions);
  sections.forEach(section => spyObserver.observe(section));
}
