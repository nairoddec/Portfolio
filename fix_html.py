with open('index.html', 'r', encoding='utf-8') as f:
    current_html = f.read()

import re

# We will rewrite the top part of index.html up to <main class="hero-section"> (or <section id="accueil" class="hero-section">)
# to match the user's requested additions cleanly.

new_top = """<!DOCTYPE html>
<html lang="fr" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dorian Decitre — Portfolio Professionnel 2026</title>
    <meta name="description" content="Portfolio professionnel de Dorian Decitre, étudiant en BUT2 RACA Informatique. Développement full-stack, administration système et infrastructure réseau.">
    <meta property="og:title" content="Dorian Decitre — Portfolio Professionnel 2026">
    <meta property="og:description" content="Développeur full-stack orienté applications et infrastructures. Étudiant BUT2 RACA Informatique à Amiens.">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    
    <link rel="stylesheet" href="css/style.css">
    <script src="js/script.js" defer></script>
    <script src="components.js" defer></script>
</head>
<body>
<theme-switcher></theme-switcher>

<canvas id="canvas"></canvas>

<!-- ============================================================
     LOADER
============================================================ -->
<div id="loader" style="position:fixed;inset:0;z-index:9999;background:#0D0B0A;display:flex;align-items:center;justify-content:center;">
    <div style="width:40px;height:40px;border:2px solid rgba(239,68,68,0.2);border-top-color:#EF4444;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
    <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
</div>

<!-- ============================================================
     NAVIGATION
============================================================ -->
<header id="dynamic-header" class="fade-up">
    <nav class="nav" id="main-nav">
        <div class="nav-container">
            <a href="#hero" class="nav-logo">DD</a>
            
            <button class="menu-burger" id="menu-toggle" aria-label="Menu">
                <span class="barre"></span>
                <span class="barre"></span>
                <span class="barre"></span>
            </button>
            
            <ul id="nav-links">
                <li><a href="#accueil" class="active">Accueil</a></li>
                <li><a href="#a-propos">À propos</a></li>
                <li><a href="#competences">Compétences</a></li>
                <li><a href="#experience">Expérience</a></li>
                <li><a href="#reflexion">Réflexion</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </nav>
</header>
"""

# Extract everything from the hero section onwards
match = re.search(r'(<section id="accueil" class="hero-section">.*)', current_html, re.DOTALL)
if not match:
    match = re.search(r'(<main class="hero-section">.*)', current_html, re.DOTALL)

if match:
    rest_of_html = match.group(1)
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_top + "\n" + rest_of_html)
