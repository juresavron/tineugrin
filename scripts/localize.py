"""Translate visible content and accessibility attributes from the same keys."""
from pathlib import Path
from html import escape
import json
import re

root = Path(__file__).resolve().parent.parent
copy = json.loads((root / 'copy.json').read_text())
for name in ('credits-rail', 'screen-section'):
    extra = json.loads((root / 'components' / f'{name}-copy.json').read_text())
    for language in ('en', 'sl'):
        for key, value in extra[language].items():
            assert key not in copy[language], (language, key)
            copy[language][key] = value
assert copy['en'].keys() == copy['sl'].keys(), 'Localisation keys must match'

content_pattern = re.compile(r'(<([a-z0-9]+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)(.*?)(</\2>)', re.S)


def translate(markup, language):
    def content(match):
        key = match.group(3)
        return match.group(1) + copy[language][key] + match.group(5)

    def attributes(match):
        tag = match.group(0)
        for attribute, key in re.findall(r'\bdata-i18n-(aria-label|alt)="([^"]+)"', tag):
            value = escape(copy[language][key], quote=True)
            tag, count = re.subn(r'(?<![\w-])' + attribute + r'="[^"]*"', lambda _: f'{attribute}="{value}"', tag)
            assert count == 1, (attribute, key)
        return tag

    markup = content_pattern.sub(content, markup)
    markup = re.sub(r'<[a-z][^<>]*>', attributes, markup)
    if language == 'sl':
        markup = markup.replace('<html lang="en">', '<html lang="sl">')
        markup = markup.replace('/assets/tine-ugrin-credits-en.pdf', '/assets/tine-ugrin-credits-sl.pdf')
        markup = markup.replace('content="en_GB"', 'content="sl_SI"')
        markup = markup.replace('content="Tine Ugrin, Slovenian actor"', 'content="Tine Ugrin, slovenski igralec"')
        markup = markup.replace('class="lang-en" aria-current="page"', 'class="lang-en"')
        markup = markup.replace('class="lang-sl"', 'class="lang-sl" aria-current="page"')
    return markup
