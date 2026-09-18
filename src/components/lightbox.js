import gsap from 'gsap';

export function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxCard = document.getElementById('lightbox-card');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!lightbox || !lightboxCard) return;

  // Collecter toutes les cartes cliquables (missions + projets)
  const cards = Array.from(document.querySelectorAll('[data-cursor="VIEW"], [data-cursor="PLAY"]'));
  let currentIndex = 0;

  // Extraire les données d'une carte
  const getCardData = (card) => {
    const media = card.querySelector('.mission-media, .project-media');
    const content = card.querySelector('.mission-content, .project-content');

    let mediaHTML = '';
    if (media) {
      const img = media.querySelector('img');
      const video = media.querySelector('video');
      if (video) {
        mediaHTML = `<div class="lightbox-media">${video.outerHTML}</div>`;
      } else if (img) {
        mediaHTML = `<div class="lightbox-media"><img src="${img.src}" alt="${img.alt}"></div>`;
      }
    }

    let bodyHTML = '';
    if (content) {
      const h3 = content.querySelector('h3');
      const p = content.querySelector('p');
      const tags = content.querySelector('.mission-tags');
      bodyHTML = `<div class="lightbox-body">`;
      if (h3) bodyHTML += `<h3>${h3.textContent}</h3>`;
      if (p) bodyHTML += `<p>${p.textContent}</p>`;
      if (tags) bodyHTML += tags.outerHTML;
      bodyHTML += `</div>`;
    }

    return mediaHTML + bodyHTML;
  };

  // Afficher une carte dans le lightbox
  const showCard = (index, direction = 0) => {
    currentIndex = index;
    const card = cards[currentIndex];
    const data = getCardData(card);

    // Animation de transition
    const xFrom = direction > 0 ? 60 : direction < 0 ? -60 : 0;

    gsap.to(lightboxCard, {
      opacity: 0,
      x: -xFrom,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        lightboxCard.innerHTML = data;
        lightboxCounter.textContent = `${currentIndex + 1} / ${cards.length}`;

        gsap.fromTo(lightboxCard,
          { opacity: 0, x: xFrom, scale: 0.98 },
          { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: 'expo.out' }
        );
      }
    });
  };

  // Ouvrir le lightbox
  const openLightbox = (index) => {
    currentIndex = index;
    lightboxCard.innerHTML = getCardData(cards[currentIndex]);
    lightboxCounter.textContent = `${currentIndex + 1} / ${cards.length}`;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Animation d'ouverture
    gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
    gsap.fromTo(lightboxCard,
      { scale: 0.85, y: 40, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', delay: 0.1 }
    );
  };

  // Fermer le lightbox
  const closeLightbox = () => {
    gsap.to(lightboxCard, { scale: 0.9, y: 30, opacity: 0, duration: 0.3, ease: 'power2.in' });
    gsap.to(lightbox, {
      opacity: 0, duration: 0.3, delay: 0.1,
      onComplete: () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  };

  // Navigation
  const goNext = () => {
    const next = (currentIndex + 1) % cards.length;
    showCard(next, 1);
  };

  const goPrev = () => {
    const prev = (currentIndex - 1 + cards.length) % cards.length;
    showCard(prev, -1);
  };

  // Event listeners
  cards.forEach((card, i) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(i);
    });
    card.style.cursor = 'none'; // Le curseur custom gère le style
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);

  // Fermer en cliquant sur l'overlay
  lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);

  // Navigation clavier
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
  });
}
