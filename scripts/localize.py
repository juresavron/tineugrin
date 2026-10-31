from pathlib import Path
import json,re

root=Path(__file__).resolve().parent.parent
copy=json.loads((root/'copy.json').read_text())
for name in ('credits-rail','screen-section','casting-file'):
    extra=json.loads((root/'components'/f'{name}-copy.json').read_text())
    for language in ('en','sl'):
        for key,value in extra[language].items():
            assert key not in copy[language],(language,key)
            copy[language][key]=value
assert copy['en'].keys()==copy['sl'].keys(), 'Localisation keys must match'
pattern=re.compile(r'(<([a-z0-9]+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)(.*?)(</\2>)',re.S)
def apply_language(markup,language):
    def translate(match):
        key=match.group(3)
        assert key in copy[language],key
        return match.group(1)+copy[language][key]+match.group(5)
    return pattern.sub(translate,markup)

def translate(markup,language):
    if language == "en":
        return apply_language(markup,language)
    sl=apply_language(markup,"sl")
    sl=sl.replace('<html lang="en">','<html lang="sl">')
    sl=sl.replace('/assets/tine-ugrin-credits-en.pdf','/assets/tine-ugrin-credits-sl.pdf').replace('content="en_GB"','content="sl_SI"')
    for old,new in {'Explore Gepack':'Več o filmu Gepack','Explore Don’t Forget to Breathe':'Več o filmu Ne pozabi dihati','Explore Legenda o bejbi':'Več o filmu Legenda o bejbi','View warm portrait of Tine':'Ogled Tinetovega portreta','View portrait of Tine in a dark suit':'Ogled portreta v temni obleki','View portrait of Tine in a black turtleneck':'Ogled portreta v črnem puliju','Main navigation':'Glavni meni','Mobile navigation':'Mobilni meni','Choose a film trailer':'Izbira filmskega napovednika','Language':'Jezik','Choose a character':'Izbira lika','View smiling portrait of Tine':'Ogled nasmejanega portreta','Professional profiles':'Poslovni profili'}.items():
        sl=sl.replace('aria-label="'+old+'"','aria-label="'+new+'"')
    for old,new in {'Portrait of Tine Ugrin by Jakob Kastelec': 'Portret Tineta Ugrina, fotograf Jakob Kastelec', 'Tine Ugrin smiling, photographed by Jakob Kastelec': 'Nasmejani Tine Ugrin, fotograf Jakob Kastelec', 'Tine Ugrin in a green sweater, photographed by Arin Rapuš Jerman': 'Tine Ugrin v zelenem puloverju, fotograf Arin Rapuš Jerman', 'Tine Ugrin in a dark suit, photographed by Jakob Kastelec': 'Tine Ugrin v temni obleki, fotograf Jakob Kastelec', 'Tine Ugrin in a black turtleneck, photographed by Arin Rapuš Jerman': 'Tine Ugrin v črnem puliju, fotograf Arin Rapuš Jerman', 'Tine Ugrin and Klara Kuk in Don’t Forget to Breathe': 'Tine Ugrin in Klara Kuk v filmu Ne pozabi dihati', 'Tine Ugrin and the cast of Gepack in a car': 'Tine Ugrin in igralska zasedba filma Gepack v avtomobilu', 'Tine Ugrin in Legenda o bejbi': 'Tine Ugrin v filmu Legenda o bejbi'}.items():
        sl=sl.replace('alt="'+old+'"','alt="'+new+'"')
    sl=sl.replace('aria-label="Portrait viewer"','aria-label="Ogled portretov"').replace('content="Tine Ugrin, Slovenian actor"','content="Tine Ugrin, slovenski igralec"')
    sl=sl.replace('<title>Tine Ugrin — Actor</title>','<title>Tine Ugrin — Igralec</title>')
    sl=sl.replace('content="Tine Ugrin. Slovenian actor working across film, television and theatre. Selected performances, portraits and casting information."','content="Tine Ugrin. Slovenski filmski, televizijski in gledališki igralec. Izbrane vloge, portreti in igralski profil."')
    sl=sl.replace('property="og:title" content="Tine Ugrin — Actor"','property="og:title" content="Tine Ugrin — Igralec"')
    sl=sl.replace('content="Selected performances. Different worlds. The portfolio of Slovenian actor Tine Ugrin."','content="Izbrane vloge. Različni svetovi. Portfelj slovenskega igralca Tineta Ugrina."')
    sl=sl.replace('property="og:url" content="https://tine-ugrin.netlify.app/"','property="og:url" content="https://tine-ugrin.netlify.app/sl/"')
    sl=sl.replace('rel="canonical" href="https://tine-ugrin.netlify.app/"','rel="canonical" href="https://tine-ugrin.netlify.app/sl/"')
    sl=sl.replace('class="lang-en" aria-current="page"','class="lang-en"').replace('class="lang-sl"','class="lang-sl" aria-current="page"')
    return sl
