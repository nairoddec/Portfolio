import emailjs from '@emailjs/browser';

export function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('btn-submit');
  
  if (!form) return;

  // L'utilisateur (Dorian) devra initialiser EmailJS avec sa propre clé publique
  // emailjs.init("YOUR_PUBLIC_KEY");

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Réinitialiser le feedback
    feedback.textContent = '';
    feedback.className = 'form-feedback';
    
    // Validation basique
    const nom = document.getElementById('nom').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if (!nom || !email || !message) {
      feedback.textContent = 'Veuillez remplir tous les champs obligatoires.';
      feedback.classList.add('error');
      return;
    }
    
    // Regex email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      feedback.textContent = 'Veuillez entrer une adresse email valide.';
      feedback.classList.add('error');
      return;
    }

    // État de chargement
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> ENVOI...';
    submitBtn.disabled = true;

    try {
      /* 
       * ATTENTION DORIAN : Remplace ces identifiants par les tiens !
       * Va sur https://www.emailjs.com/ pour créer ton compte.
       * 
       * SERVICE_ID = ton identifiant de service email
       * TEMPLATE_ID = ton identifiant de template email
       * PUBLIC_KEY = ta clé publique (à mettre dans emailjs.init ou en 3ème paramètre)
       */
      
      // Simulation pour l'instant (à remplacer par le vrai appel emailjs.sendForm)
      // await emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form, 'YOUR_PUBLIC_KEY');
      
      // Simulation d'un délai d'envoi de 1.5s
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      feedback.textContent = 'Message envoyé avec succès ! Je vous réponds sous 48h.';
      feedback.classList.add('success');
      form.reset();
      
    } catch (error) {
      console.error('Erreur EmailJS:', error);
      feedback.textContent = 'Une erreur est survenue. Veuillez réessayer plus tard ou m\'envoyer un email direct.';
      feedback.classList.add('error');
    } finally {
      // Restaurer le bouton
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}
