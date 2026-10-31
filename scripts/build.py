"""Build a real static page for each portfolio destination in both languages."""
from pathlib import Path
from html import escape
import json
import re
from localize import copy, translate

root = Path(__file__).resolve().parent.parent
dist = root / 'dist'
origin = 'https://tine-ugrin.netlify.app'
pages = {
    'home': ('', 'hero-title', {'en': 'Actor', 'sl': 'Igralec'}),
    'about': ('about', 'about-heading', {'en': 'About', 'sl': 'O meni'}),
    'credits': ('credits', 'credits-heading', {'en': 'Credits', 'sl': 'Vloge'}),
    'screen': ('video', 'screen-heading', {'en': 'Video', 'sl': 'Video'}),
    'portraits': ('gallery', 'portraits-heading', {'en': 'Gallery', 'sl': 'Galerija'}),
    'contact': ('contact', 'contact-heading', {'en': 'Contact', 'sl': 'Kontakt'}),
}
descriptions = {
    'home': {
        'en': 'Tine Ugrin — Slovenian film, television and theatre actor. Portraits, trailers and casting information.',
        'sl': 'Tine Ugrin — slovenski filmski, televizijski in gledališki igralec. Portreti, napovedniki in igralski profil.',
    },
    'about': {
        'en': 'Biography, languages and casting profile of Slovenian actor Tine Ugrin.',
        'sl': 'O slovenskem igralcu Tinetu Ugrinu, njegovih vlogah, jezikih in igralskem profilu.',
    },
    'credits': {
        'en': 'Selected film and television credits for Tine Ugrin. Download the PDF or browse his full filmography.',
        'sl': 'Izbrane filmske in televizijske vloge Tineta Ugrina. Prenesite PDF ali si oglejte celotno filmografijo.',
    },
    'screen': {
        'en': 'Watch official trailers for Gepack and Don’t Forget to Breathe, featuring Tine Ugrin.',
        'sl': 'Uradna napovednika filmov Gepack in Ne pozabi dihati s Tinetom Ugrinom.',
    },
    'portraits': {
        'en': 'Portraits and downloadable headshots of actor Tine Ugrin. Photography by Jakob Kastelec and Arin Rapuš Jerman.',
        'sl': 'Portreti igralca Tineta Ugrina za prenos. Fotografije Jakoba Kastelca in Arina Rapuša Jermana.',
    },
    'contact': {
        'en': 'Casting enquiries for Tine Ugrin via his Filmmakers profile.',
        'sl': 'Kontakt Tineta Ugrina za casting in sodelovanja prek profila Filmmakers.',
    },
}


def path_for(section, language):
    slug = pages[section][0]
    return ('/sl/' if language == 'sl' else '/') + (slug + '/' if slug else '')


def main():
    source = (root / 'src/index.html').read_text()
    components = {path.stem: path.read_text().strip() for path in (root / 'components').glob('*.html')}
    for name in ('site-header', 'credits-rail', 'screen-section'):
        marker = '<!-- component:' + name + ' -->'
        assert source.count(marker) == 1, 'Missing or repeated component: ' + name
        source = source.replace(marker, components[name])
    main_start = source.index('  <main id="main">')
    main_end = source.index('  </main>', main_start) + len('  </main>')
    sections = {}
    for match in re.finditer(r'<section\b[^>]*\bid="([^"]+)"[^>]*>.*?</section>', source[main_start:main_end], re.S):
        sections[match.group(1)] = match.group(0)
    assert sections.keys() == pages.keys(), sections.keys()
    runtime_keys = set(re.findall(r"\bt\('([^']+)'\)", (dist / 'assets/site.js').read_text()))
    runtime_copy = {language: {key: copy[language][key] for key in sorted(runtime_keys)} for language in ('en', 'sl')}
    (dist / 'assets/copy.js').write_text('window.TINE_COPY = ' + json.dumps(runtime_copy, ensure_ascii=False, separators=(',', ':')) + ';\n')

    for section, (slug, heading, names) in pages.items():
        body = sections[section]
        if section != 'home':
            body, count = re.subn(r'<h2(\s+id="' + heading + r'"[^>]*)>(.*?)</h2>', r'<h1\1>\2</h1>', body, count=1, flags=re.S)
            assert count == 1, heading
        page = source[:main_start] + '  <main id="main" class="page-main">\n    ' + body + '\n  </main>' + source[main_end:]
        page = page.replace('<body>', f'<body class="page-{section}' + (' page-content' if section != 'home' else '') + f'" data-page="{section}">')
        if section != 'home':
            page = re.sub(r'  <link rel="preload" href="/assets/hero.webp"[^>]+>\n', '', page)
        for name, included in (
            ('page-footer', section != 'home'),
            ('photo-credits-dialog', section != 'home'),
            ('film-dialog', section == 'screen'),
            ('portrait-dialog', section == 'portraits'),
        ):
            marker = '<!-- component:' + name + ' -->'
            assert page.count(marker) == 1, 'Missing or repeated component: ' + name
            page = page.replace(marker, components[name] if included else '')

        for language in ('en', 'sl'):
            rendered = translate(page, language)
            path = path_for(section, language)
            for destination in pages:
                rendered = rendered.replace(f'href="#{destination}"', f'href="{path_for(destination, language)}"')
            rendered = rendered.replace('href="#work"', f'href="{path_for("credits", language)}"')
            if language == 'sl':
                rendered = rendered.replace('href="/"', 'href="/sl/"')
            if section != 'home':
                rendered = rendered.replace(f'href="{path}" data-i18n="nav', f'href="{path}" aria-current="page" data-i18n="nav')
            title = 'Tine Ugrin — ' + names[language] if section == 'home' else names[language] + ' — Tine Ugrin'
            description = escape(descriptions[section][language], quote=True)
            rendered = re.sub(r'<title>.*?</title>', '<title>' + title + '</title>', rendered)
            for attribute, key, value in [('name', 'description', description), ('property', 'og:title', escape(title, quote=True)), ('property', 'og:description', description), ('property', 'og:url', origin + path)]:
                rendered = re.sub(r'(<meta ' + attribute + '="' + key + r'" content=")[^"]*(">)', lambda m: m.group(1) + value + m.group(2), rendered)
            rendered = re.sub(r'(<link rel="canonical" href=")[^"]*(">)', lambda m: m.group(1) + origin + path + m.group(2), rendered)
            for alternate in ('x-default', 'en', 'sl'):
                target = path_for(section, 'sl' if alternate == 'sl' else 'en')
                rendered = re.sub(r'(<link rel="alternate" hreflang="' + alternate + r'" href=")[^"]*(">)', lambda m: m.group(1) + origin + target + m.group(2), rendered)
            rendered = re.sub(r'href="[^"]*" lang="en" class="lang-en"', f'href="{path_for(section,"en")}" lang="en" class="lang-en"', rendered)
            rendered = re.sub(r'href="[^"]*" lang="sl" class="lang-sl"', f'href="{path_for(section,"sl")}" lang="sl" class="lang-sl"', rendered)
            output = dist / path.lstrip('/') / 'index.html'
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_text('\n'.join(line.rstrip() for line in rendered.splitlines()) + '\n')

    entries = []
    for section in pages:
        for language in ('en', 'sl'):
            alternates = ''.join(f'<xhtml:link rel="alternate" hreflang="{lang}" href="{origin}{path_for(section,lang)}" />' for lang in ('en', 'sl'))
            entries.append(f'  <url><loc>{origin}{path_for(section,language)}</loc>{alternates}</url>')
    (dist / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + '\n'.join(entries) + '\n</urlset>\n')
    print(json.dumps({'pages': len(pages) * 2, 'languages': ['en', 'sl'], 'translation_keys': len(copy['en'])}))


if __name__ == '__main__':
    main()
