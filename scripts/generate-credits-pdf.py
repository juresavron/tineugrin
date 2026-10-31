#!/usr/bin/env python3
"""Regenerate the two checked-in A4 selected-credit PDFs.

Local authoring utility only: requires ReportLab and fontTools, and is not part of
the Netlify/site build. Run from any directory with:
    python3 scripts/generate-credits-pdf.py
The website ships the prebuilt PDFs in dist/assets/.
"""

from pathlib import Path
from io import BytesIO

from fontTools.ttLib import TTFont as SourceFont
from fontTools.varLib.instancer import instantiateVariableFont

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "dist" / "assets"
PAGE_W, PAGE_H = A4
PAPER = HexColor("#FFFFFF")
INK = HexColor("#101615")
MUTED = HexColor("#5A605C")
RULE = HexColor("#CECFC9")
LEFT, RIGHT = 44, PAGE_W - 44

CASTING = "https://www.filmmakers.eu/en/actors/tine-ugrin"
PORTFOLIO = "https://tine-ugrin.netlify.app"
IMDB = "https://www.imdb.com/name/nm5864569/"

# Use the website font. ReportLab needs static instances of the variable font.
for name, style, weight in (("Space", "Regular", 400), ("SpaceMedium", "Medium", 500), ("SpaceSemibold", "Semibold", 600)):
    font = SourceFont(ASSETS / "fonts" / "space-grotesk.ttf")
    instance = instantiateVariableFont(font, {"wght": weight}, inplace=True)
    # Distinct PostScript names prevent PDF font caches merging the weights.
    names = {1: "Space Grotesk", 2: style, 4: "Space Grotesk " + style,
             6: "SpaceGrotesk-" + style, 16: "Space Grotesk", 17: style}
    for record in instance["name"].names:
        if record.nameID in names:
            record.string = names[record.nameID].encode(record.getEncoding())
    data = BytesIO()
    instance.save(data)
    data.seek(0)
    pdfmetrics.registerFont(TTFont(name, data))


TEXT = {
    "en": {
        "actor": "Actor / Film, television & theatre",
        "languages_label": "LANGUAGES",
        "languages": ["Slovenian · English", "Italian · Serbo-Croatian"],
        "section": "Selected screen credits",
        "columns": ["PROJECT", "ROLE", "FORMAT", "YEAR"],
        "short": "Short film",
        "feature": "Feature film",
        "series": "Television series",
        "tv_actor": "TV actor",
        "breathe": "Don't Forget to Breathe",
        "contact": "CASTING PROFILE",
        "portfolio": "PORTFOLIO",
        "photo": "Portrait © Jakob Kastelec",
        "date": "October 2026 / EN",
    },
    "sl": {
        "actor": "Igralec / Film, televizija in gledališče",
        "languages_label": "JEZIKI",
        "languages": ["Slovenščina · Angleščina", "Italijanščina · Srbohrvaščina"],
        "section": "Izbrane filmske in televizijske vloge",
        "columns": ["PROJEKT", "VLOGA", "FORMAT", "LETO"],
        "short": "Kratki film",
        "feature": "Celovečerni film",
        "series": "Televizijska serija",
        "tv_actor": "TV igralec",
        "breathe": "Ne pozabi dihati",
        "contact": "IGRALSKI PROFIL",
        "portfolio": "PORTFELJ",
        "photo": "Portret © Jakob Kastelec",
        "date": "Oktober 2026 / SL",
    },
}


def label(c, text, x, y, size=9, color=MUTED, align="left"):
    """Small, tracked labels with a predictable width for right alignment."""
    tracking = 0.4
    width = pdfmetrics.stringWidth(text, "SpaceMedium", size)
    width += max(0, len(text) - 1) * tracking
    if align == "right":
        x -= width
    obj = c.beginText(x, y)
    obj.setFont("SpaceMedium", size)
    obj.setCharSpace(tracking)
    obj.setFillColor(color)
    obj.textOut(text)
    obj.setCharSpace(0)
    c.drawText(obj)


def line(c, y, color=RULE, width=0.5):
    c.setStrokeColor(color)
    c.setLineWidth(width)
    c.line(LEFT, y, RIGHT, y)


def text(c, value, x, y, font="Space", size=10, color=INK):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawString(x, y, value)


def link(c, value, url, x, y, size=9.6):
    text(c, value, x, y, "SpaceMedium", size)
    width = pdfmetrics.stringWidth(value, "SpaceMedium", size)
    c.setStrokeColor(INK)
    c.setLineWidth(0.4)
    c.line(x, y - 2, x + width, y - 2)
    c.linkURL(url, (x, y - 3, x + width, y + size + 3), relative=0)


def generate(language):
    t = TEXT[language]
    path = ASSETS / f"tine-ugrin-credits-{language}.pdf"
    c = canvas.Canvas(str(path), pagesize=A4, pageCompression=1,
                      invariant=1, pdfVersion=(1, 4))
    c.setTitle(f"Tine Ugrin | {t['section']}")
    c.setAuthor("Tine Ugrin")
    c.setSubject(t["section"])
    c.setCreator("Tine Ugrin portfolio")

    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    text(c, "TINE UGRIN", LEFT, 753, "SpaceSemibold", 36)
    text(c, t["actor"], LEFT, 728, size=10.4)
    label(c, t["languages_label"], LEFT, 675)
    for i, value in enumerate(t["languages"]):
        text(c, value, LEFT, 656 - i * 17, size=11)

    portrait_w = 146
    portrait_h = portrait_w * 2160 / 1550
    portrait_x = RIGHT - portrait_w
    portrait_y = 800 - portrait_h
    # Original website hero portrait; its aspect ratio and photographer credit
    # are preserved without additional cropping or retouching.
    c.drawImage(str(ASSETS / "hero-download.jpg"), portrait_x, portrait_y,
                width=portrait_w, height=portrait_h)
    text(c, t["photo"], portrait_x, portrait_y - 15, size=8, color=MUTED)

    text(c, t["section"], LEFT, 533, "Space", 22)
    project_x, role_x, format_x = LEFT, 250, 340
    for value, x in zip(t["columns"][:3], (project_x, role_x, format_x)):
        label(c, value, x, 489)
    label(c, t["columns"][3], RIGHT, 489, align="right")
    line(c, 477, color=INK, width=0.75)

    # Seven verified selected screen credits. Dates and role names mirror the
    # website copy; Tibor Fortuna was additionally verified against the official
    # Filmmakers profile (https://www.filmmakers.eu/en/actors/tine-ugrin).
    rows = [
        ("Ni v navodilih", "Matej", t["short"], "2025"),
        ("Sužnji", "Tim", t["short"], "2025"),
        ("Gepack", "Jon", t["feature"], "2024"),
        ("Legenda o bejbi", t["tv_actor"], t["short"], "2024"),
        ("Gospod profesor", "Tibor Fortuna", t["series"], "2022-23"),
        (t["breathe"], "Peter", t["feature"], "2019"),
        ("Nika", "Žan", t["feature"], "2016"),
    ]
    for i, (project, role, form, year) in enumerate(rows):
        y = 452 - i * 38
        text(c, project, project_x, y, "SpaceMedium", 11.1)
        text(c, role, role_x, y, size=9.8)
        text(c, form, format_x, y, size=9.4)
        c.setFont("Space", 10.2)
        c.setFillColor(INK)
        c.drawRightString(RIGHT, y, year)
        line(c, y - 13)

    label(c, t["contact"], LEFT, 172)
    link(c, "filmmakers.eu/en/actors/tine-ugrin", CASTING, LEFT, 155)
    label(c, t["portfolio"], LEFT, 122)
    link(c, "tine-ugrin.netlify.app", PORTFOLIO, LEFT, 105)
    label(c, "IMDB", 316, 122)
    link(c, "imdb.com/name/nm5864569/", IMDB, 316, 105)

    line(c, 76)
    text(c, "TINE UGRIN", LEFT, 54, "SpaceMedium", 10, MUTED)
    c.setFillColor(MUTED)
    c.setFont("Space", 9)
    c.drawRightString(RIGHT, 54, t["date"])
    c.showPage()
    c.save()
    print(path.relative_to(ROOT), path.stat().st_size, "bytes")


if __name__ == "__main__":
    for lang in ("en", "sl"):
        generate(lang)
