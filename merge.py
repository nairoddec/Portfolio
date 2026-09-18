import re

files = ['index.html', 'a-propos.html', 'competences.html', 'experience.html', 'reflexion.html', 'contact.html']
merged_content = ""
nav_links = {
    'index.html': '#accueil',
    'a-propos.html': '#a-propos',
    'competences.html': '#competences',
    'experience.html': '#experience',
    'reflexion.html': '#reflexion',
    'contact.html': '#contact'
}

with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

# Replace nav links in index
for old, new in nav_links.items():
    index_html = index_html.replace(f'href="{old}"', f'href="{new}"')

# Extract main section of index
main_match = re.search(r'(<main class="hero-section".*?</main>)', index_html, re.DOTALL)
if main_match:
    hero_section = main_match.group(1).replace('<main', '<section id="accueil"').replace('</main>', '</section>')
    index_html = index_html.replace(main_match.group(1), hero_section)

# Now, we want to append the <main> contents of other files as <section>s just after the hero section
sections = [hero_section]

for file in files[1:]:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        main_content = re.search(r'<main[^>]*>(.*?)</main>', content, re.DOTALL)
        if main_content:
            section_id = file.replace('.html', '')
            section_html = f'<section id="{section_id}">\n{main_content.group(1)}\n</section>'
            sections.append(section_html)

all_sections_html = "\n\n".join(sections)

# Replace the original hero section with all sections
index_html = index_html.replace(hero_section, all_sections_html)

with open('index-merged.html', 'w', encoding='utf-8') as f:
    f.write(index_html)
