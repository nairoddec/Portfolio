export function initTextHover() {
  const hoverElements = document.querySelectorAll('.lando-text-hover');
  
  if (!hoverElements.length) return;

  // We only run this if the user hasn't reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  hoverElements.forEach((el) => {
    // Save original text in case we need it
    const text = el.textContent.trim();
    if (!text) return;

    // Use Intl.Segmenter to properly handle emojis and complex characters if available
    // Fallback to split if not available (e.g. older Firefox)
    let chars = [];
    if (window.Intl && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter("fr", { granularity: "grapheme" });
      chars = Array.from(segmenter.segment(text), (s) => s.segment);
    } else {
      chars = text.split('');
    }
    
    // Clear the element
    el.textContent = '';
    
    // Wrapper for accessibility (screen readers will read the aria-label)
    el.setAttribute('aria-label', text);
    el.setAttribute('role', 'text');

    chars.forEach((char, index) => {
      // Create a span for each character
      const span = document.createElement('span');
      // Replace space with non-breaking space so it doesn't collapse
      const displayChar = char === ' ' ? '\u00A0' : char;
      
      span.setAttribute('data-char', displayChar);
      span.style.setProperty('--index', index);
      span.textContent = displayChar;
      span.setAttribute('aria-hidden', 'true');
      
      el.appendChild(span);
    });
  });
}
