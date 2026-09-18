import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to find everything after the hero section and replace it.
# The hero section ends with </section> because I renamed <main class="hero-section"> to <section id="accueil" class="hero-section">
# Wait, did I? Yes, I did in my previous script:
# `hero_section = main_match.group(1).replace('<main', '<section id="accueil"').replace('</main>', '</section>')`

# Let's just find the end of the first section (the hero section)
match = re.search(r'(<section id="accueil" class="hero-section">.*?</section>)', content, re.DOTALL)
if match:
    hero = match.group(1)
    
    # We want to replace everything after hero section up to </body> with the new footer
    
    new_footer = """
<!-- ============================================================
     FOOTER
============================================================ -->
<footer class="site-footer">
    <div class="footer-content">
        <div class="footer-logo">
            <h3>Dorian Decitre</h3>
            <p>Étudiant BUT2 RACA Informatique</p>
        </div>
        <div class="footer-social">
            <h4>Réseaux</h4>
            <div class="social-icons">
                <a href="https://github.com/nairoddec" target="_blank" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
                <a href="https://www.linkedin.com/in/dorian-decitre/" target="_blank" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="mailto:contact@doriandecitre.fr" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>
            </div>
        </div>
    </div>
    <div class="footer-bottom">
        <p>&copy; 2026 Dorian Decitre. Tous droits réservés.</p>
    </div>
</footer>
<script type="module" src="/src/main.js"></script>
</body>
</html>
"""
    
    # Extract everything before hero + hero + new_footer
    before_hero = content[:match.start()]
    new_content = before_hero + hero + "\n" + new_footer
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
        
