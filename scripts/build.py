"""Build the reference-led homepage and keep existing standalone routes working."""
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
    'thanks': ('thank-you', 'thanks-heading', {'en': 'Thank you', 'sl': 'Hvala'}),
}
descriptions = {
    'home': {
        'en': 'Tine Ugrin — Slovenian film, television and theatre actor. Portraits, trailers and casting information.',
        'sl': 'Tine Ugrin — slovenski filmski, televizijski in gledališki igralec. Portreti, napovedniki in igralski profil.',
    },
    'about': {
        'en': 'Tine Ugrin — Slovenian actor based in Ljubljana. Training, languages, casting details and his 2026 acting CV.',
        'sl': 'Tine Ugrin — slovenski igralec iz Ljubljane. Izobraževanje, jeziki, podatki za casting in igralski CV za leto 2026.',
    },
    'credits': {
        'en': 'Selected screen and theatre credits, upcoming projects and the complete 2026 acting CV of Tine Ugrin.',
        'sl': 'Izbrane filmske, televizijske in gledališke vloge, prihajajoči projekti ter celoten igralski CV Tineta Ugrina za leto 2026.',
    },
    'screen': {
        'en': 'Watch official trailers for Gepack, Don’t Forget to Breathe and Nika, featuring Tine Ugrin.',
        'sl': 'Uradni napovedniki filmov Gepack, Ne pozabi dihati in Nika s Tinetom Ugrinom.',
    },
    'portraits': {
        'en': 'Portraits and downloadable headshots of actor Tine Ugrin. Photography by Jakob Kastelec and Arin Rapuš Jerman.',
        'sl': 'Portreti igralca Tineta Ugrina za prenos. Fotografije Jakoba Kastelca in Arina Rapuša Jermana.',
    },
    'contact': {
        'en': 'Contact actor Tine Ugrin directly for casting and professional enquiries.',
        'sl': 'Neposredni kontakt igralca Tineta Ugrina za casting in sodelovanja.',
    },
    'thanks': {'en': 'Thank you for your message to Tine Ugrin.', 'sl': 'Hvala za vaše sporočilo Tinetu Ugrinu.'},
}


def path_for(section, language):
    slug = pages[section][0]
    return ('/sl/' if language == 'sl' else '/') + (slug + '/' if slug else '')


def main():
    source = (root / 'src/index.html').read_text()
    components = {path.stem: path.read_text().strip() for path in (root / 'components').glob('*.html')}
    page_components = {
        'home': ['hero', 'intro', 'about', 'credits-rail', 'gallery', 'screen-section', 'contact'],
        'about': ['about'], 'credits': ['credits-rail'], 'screen': ['screen-section'],
        'portraits': ['gallery'], 'contact': ['contact'], 'thanks': ['thank-you'],
    }
    runtime_keys = set(re.findall(r"\bt\('([^']+)'\)", (dist / 'assets/site.js').read_text()))
    runtime_copy = {language: {key: copy[language][key] for key in sorted(runtime_keys)} for language in ('en', 'sl')}
    (dist / 'assets/copy.js').write_text('window.TINE_COPY = ' + json.dumps(runtime_copy, ensure_ascii=False, separators=(',', ':')) + ';\n')

    for section, (slug, heading, names) in pages.items():
        body = '\n'.join(components[name] for name in page_components[section])
        if section != 'home':
            body = re.sub(r'<(/?)h([2-6])(\b[^>]*)>', lambda m: '<' + m.group(1) + 'h' + str(int(m.group(2)) - 1) + m.group(3) + '>', body)
        assert 'id="' + heading + '"' in body, heading
        page = source.replace('<!-- page-content -->', body)
        page = page.replace('<body>', f'<body class="page-{section}' + (' page-content' if section != 'home' else '') + f'" data-page="{section}">')
        for name, included in (
            ('site-header', True), ('page-footer', True), ('photo-credits-dialog', True),
            ('film-dialog', section in ('home', 'screen')),
            ('portrait-dialog', section in ('home', 'portraits')),
        ):
            marker = '<!-- component:' + name + ' -->'
            assert page.count(marker) == 1, 'Missing or repeated component: ' + name
            page = page.replace(marker, components[name] if included else '')
        if section != 'home':
            page = re.sub(r'  <link rel="preload" href="/assets/hero.webp"[^>]+>\n', '', page)
        if section == 'thanks':
            page = page.replace('<meta name="viewport"', '<meta name="robots" content="noindex,follow">\n  <meta name="viewport"')

        for language in ('en', 'sl'):
            rendered = translate(page, language)
            path = path_for(section, language)
            if section != 'home':
                for destination in pages:
                    rendered = rendered.replace(f'href="#{destination}"', f'href="{path_for(destination, language)}"')
            if language == 'sl':
                rendered = rendered.replace('href="/"', 'href="/sl/"')
                rendered = rendered.replace('action="/thank-you/"', 'action="/sl/thank-you/"')
                rendered = rendered.replace('value="en" data-form-language', 'value="sl" data-form-language')
            if section not in ('home', 'thanks'):
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
        if section == 'thanks':
            continue
        for language in ('en', 'sl'):
            alternates = ''.join(f'<xhtml:link rel="alternate" hreflang="{lang}" href="{origin}{path_for(section,lang)}" />' for lang in ('en', 'sl'))
            entries.append(f'  <url><loc>{origin}{path_for(section,language)}</loc>{alternates}</url>')
    (dist / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + '\n'.join(entries) + '\n</urlset>\n')
    print(json.dumps({'pages': len(pages) * 2, 'languages': ['en', 'sl'], 'translation_keys': len(copy['en'])}))


if __name__ == '__main__':
    main()
