from pathlib import Path
import json,re

root=Path(__file__).resolve().parent.parent
copy=json.loads((root/'copy.json').read_text())
for name in ('character-study','portrait-contact-sheet','casting-file'):
    extra=json.loads((root/'components'/f'{name}-copy.json').read_text())
    for language in ('en','sl'):
        for key,value in extra[language].items():
            assert key not in copy[language],(language,key)
            copy[language][key]=value
assert copy['en'].keys()==copy['sl'].keys(), 'Localisation keys must match'
source=(root/'dist/index.html').read_text()
source=source.replace('2017—2025','2016—2025')
(root/'dist/assets/copy.js').write_text('window.TINE_COPY = '+json.dumps(copy,ensure_ascii=False,separators=(',',':'))+';\n')
pattern=re.compile(r'(<([a-z0-9]+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)(.*?)(</\2>)',re.S)
def apply_language(markup,language):
    def translate(match):
        key=match.group(3)
        assert key in copy[language],key
        return match.group(1)+copy[language][key]+match.group(5)
    return pattern.sub(translate,markup)
source=apply_language(source,'en')
(root/'dist/index.html').write_text(source)
sl=apply_language(source,'sl')
sl=sl.replace('<html lang="en">','<html lang="sl">')
for old,new in {'Explore Gepack':'Več o filmu Gepack','Explore Don’t Forget to Breathe':'Več o filmu Ne pozabi dihati','Explore Legenda o bejbi':'Več o filmu Legenda o bejbi','View warm portrait of Tine':'Ogled Tinetovega portreta','View portrait of Tine in a dark suit':'Ogled portreta v temni obleki','View portrait of Tine in a black turtleneck':'Ogled portreta v črnem puliju','Main navigation':'Glavni meni','Mobile navigation':'Mobilni meni','Choose a film trailer':'Izbira filmskega napovednika','Language':'Jezik','Choose a character':'Izbira lika'}.items():
    sl=sl.replace('aria-label="'+old+'"','aria-label="'+new+'"')
sl=sl.replace('<title>Tine Ugrin — Actor</title>','<title>Tine Ugrin — Igralec</title>')
sl=sl.replace('content="Tine Ugrin. Slovenian actor working across film, television and theatre. Selected performances, portraits and casting information."','content="Tine Ugrin. Slovenski filmski, televizijski in gledališki igralec. Izbrane vloge, portreti in igralski profil."')
sl=sl.replace('property="og:title" content="Tine Ugrin — Actor"','property="og:title" content="Tine Ugrin — Igralec"')
sl=sl.replace('content="Selected performances. Different worlds. The portfolio of Slovenian actor Tine Ugrin."','content="Izbrane vloge. Različni svetovi. Portfelj slovenskega igralca Tineta Ugrina."')
sl=sl.replace('property="og:url" content="https://tine-ugrin-portfolio.juresavron.chatgpt.site/"','property="og:url" content="https://tine-ugrin-portfolio.juresavron.chatgpt.site/sl/"')
sl=sl.replace('rel="canonical" href="https://tine-ugrin-portfolio.juresavron.chatgpt.site/"','rel="canonical" href="https://tine-ugrin-portfolio.juresavron.chatgpt.site/sl/"')
sl=sl.replace('class="lang-en" aria-current="page"','class="lang-en"').replace('class="lang-sl"','class="lang-sl" aria-current="page"')
out=root/'dist/sl/index.html';out.parent.mkdir(exist_ok=True);out.write_text(sl)
print(json.dumps({'languages':['en','sl'],'translation_keys':len(copy['en'])}))
