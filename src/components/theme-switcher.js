export function initThemeSwitcher() {
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  
  if (!themeToggle) return;

  // Icones SVG pour éviter d'utiliser FontAwesome direct (plus léger et sûr)
  const moonIcon = '<i class="fa-solid fa-moon"></i>';
  const sunIcon = '<i class="fa-solid fa-sun"></i>';

  // Récupérer le thème sauvegardé
  const savedTheme = localStorage.getItem('portfolio-theme');
  
  // Appliquer le thème initial
  if (savedTheme === 'light') {
    htmlElement.setAttribute('data-theme', 'light');
    themeToggle.innerHTML = sunIcon;
  } else {
    // Par défaut dark
    htmlElement.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = moonIcon;
  }

  // Gérer le clic
  themeToggle.addEventListener('click', () => {
    // Ajouter une classe temporaire pour la transition fluide
    document.body.classList.add('theme-transitioning');
    
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    
    // Changer l'icône
    themeToggle.innerHTML = newTheme === 'dark' ? moonIcon : sunIcon;
    
    // Retirer la classe de transition après l'animation
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 500);
  });
}
