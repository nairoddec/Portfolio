import WebGLManager from "./webgl/WebGLManager.js";
import "./styles/main.css";
import { initNavigation } from "./components/navigation.js";
import { initThemeSwitcher } from "./components/theme-switcher.js";
import { initSmoothScroll } from "./components/smooth-scroll.js";
import { initContactForm } from "./components/contact-form.js";
import { initLightbox } from "./components/lightbox.js";
import { initScrollAnimations } from "./animations/scroll-animations.js";
import { initTextReveal } from "./animations/text-reveal.js";

console.log("Initialisation de WebGLManager...")

document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.getElementById("loader");
  const hideLoader = () => {
    if (!loader) return;

    loader.style.opacity = "0";
    loader.style.transition = "opacity 300ms ease";
    window.setTimeout(() => loader.remove(), 300);
  };

  initThemeSwitcher();
  initNavigation();
  initSmoothScroll();
  initContactForm();
  initLightbox();
  initTextReveal();
  initScrollAnimations();

  const canvas = document.getElementById("canvas");
  if (!canvas) {
    console.error("Canvas non trouvé.")
    hideLoader();
    return;
  }

  const webGLManager = new WebGLManager("canvas");
  try {
    await webGLManager.init();
    webGLManager.setupScrollAnimations();
  } catch (error) {
    console.error("Erreur lors de l'initialisation :", error)
  } finally {
    // Le portfolio doit rester utilisable même si le modèle 3D ne se charge pas.
    hideLoader();
  }
});
