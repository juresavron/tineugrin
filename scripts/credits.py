"""Render the owner's complete CV credits as accessible static HTML."""
from pathlib import Path
from html import escape
import json

DATA = json.loads((Path(__file__).resolve().parent.parent / 'content/credits.json').read_text())
CATEGORIES = {
    'television': ('Television', 'Televizija'),
    'features': ('Feature films', 'Celovečerni filmi'),
    'shorts': ('Short films', 'Kratki filmi'),
    'microdramas': ('Microdramas', 'Mikrodrame'),
    'music': ('Music videos', 'Glasbeni videospoti'),
    'commercials': ('Commercials', 'Oglasi'),
    'theatre': ('Theatre', 'Gledališče'),
}
TYPES = {'lead': ('Leading Role', 'Glavna vloga'), 'supporting': ('Supporting Role', 'Stranska vloga'), 'lead-male': ('Leading Male Role', 'Glavna moška vloga')}


def local(value, lang):
    return value.get(lang, '') if isinstance(value, dict) else (value or '')


def pair(value, lang):
    return value[lang == 'sl']


def render_table(entries, lang, caption):
    labels = [('Project', 'Projekt'), ('Role', 'Vloga'), ('Role type', 'Vrsta vloge'), ('Year', 'Leto')]
    heads = ''.join('<th role="columnheader" scope="col">' + pair(label, lang) + '</th>' for label in labels)
    rows = []
    for item in entries:
        title, role, year = [escape(local(item[key], lang)) for key in ('title', 'role', 'year')]
        role_type = pair(TYPES[item['role_type']], lang) if item['role_type'] else '—'
        category = pair(CATEGORIES[item['category']], lang)
        facts = []
        for label, key in [(('Production / venue', 'Produkcija / prizorišče'), 'production'), (('Director', 'Režija'), 'director'), (('Brand', 'Znamka'), 'brand')]:
            if item.get(key):
                facts.append('<div><dt>' + pair(label, lang) + '</dt><dd>' + escape(item[key]) + '</dd></div>')
        link = ''
        if item['url']:
            label = pair(('More about this project', 'Več o projektu'), lang)
            link = '<a class="text-link project-external" href="' + escape(item['url'], quote=True) + '" target="_blank" rel="noopener noreferrer">' + label + ' <span aria-hidden="true">↗</span></a>'
        upcoming = ' <span class="credit-status">' + pair(('Upcoming', 'Prihaja'), lang) + '</span>' if item['status'] == 'upcoming' else ''
        project = '<details class="project-details"><summary>' + title + '<span class="project-mark" aria-hidden="true">+</span></summary><div class="project-meta"><p>' + escape(category) + ' · ' + year + '</p><dl>' + ''.join(facts) + '</dl>' + link + '</div></details>'
        rows.append('<tr role="row" data-credit-id="' + item['id'] + '"><th role="rowheader" scope="row">' + project + '</th><td role="cell">' + (role or '—') + '</td><td role="cell" class="credit-role-type">' + role_type + '</td><td role="cell">' + year + upcoming + '</td></tr>')
    return '<table class="cr-table" role="table"><caption>' + escape(caption) + '</caption><thead role="rowgroup"><tr role="row">' + heads + '</tr></thead><tbody role="rowgroup">' + ''.join(rows) + '</tbody></table>'


def render_credits(lang, selected=False, heading_level=4):
    if selected:
        by_id = {item['id']: item for item in DATA['entries']}
        items = [by_id[key] for key in DATA['selected']]
        return render_table(items, lang, pair(('Tine Ugrin — selected film and television credits', 'Tine Ugrin — izbrane filmske in televizijske vloge'), lang))
    groups = []
    for category, name in CATEGORIES.items():
        items = [item for item in DATA['entries'] if item['category'] == category]
        title = pair(name, lang)
        groups.append('<div class="credits-group"><h' + str(heading_level) + ' class="credits-subtitle">' + title + '</h' + str(heading_level) + '>' + render_table(items, lang, 'Tine Ugrin — ' + title) + '</div>')
    return '\n'.join(groups)
