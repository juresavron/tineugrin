from pathlib import Path
from html.parser import HTMLParser
import re,json
from urllib.parse import urlsplit

root=Path(__file__).resolve().parent.parent
dist=root/'dist'
class Audit(HTMLParser):
    def __init__(self):super().__init__();self.ids=[];self.links=[];self.keys=[];self.errors=[];self.stack=[];self.images=0;self.headings=0;self.main_sections=[];self.active_nav=[];self.canonical=None;self.alternates={};self.language=None;self.form_names=[];self.form_fields=[];self.nav_links=[];self.page=None
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='html':self.language=a.get('lang')
        if tag=='h1':self.headings+=1
        if tag=='body':self.page=a.get('data-page')
        if tag=='form':
            assert a.get('data-netlify')=='true' and a.get('method')=='POST' and a.get('netlify-honeypot')=='bot-field', (tag,a)
            self.form_names.append(a.get('name'))
            self.links.append(a['action'])
        if tag in ('input','textarea'):self.form_fields.append(a.get('name'))
        if tag=='section' and self.stack and self.stack[-1]=='main':self.main_sections.append(a.get('id'))
        if tag=='a' and a.get('data-i18n','').startswith('nav'):
            self.nav_links.append(a.get('href',''))
            if a.get('aria-current')=='page':self.active_nav.append(a['href'])
        if tag=='link' and a.get('rel')=='canonical':self.canonical=a.get('href')
        if tag=='link' and a.get('rel')=='alternate':self.alternates[a.get('hreflang')]=a.get('href')
        if 'id' in a:self.ids.append(a['id'])
        for attr in ('href','src'):
            if a.get(attr):self.links.append(a[attr])
        if tag=='img':
            self.images+=1
            if 'alt' not in a:self.errors.append('Image missing alt')
        if tag not in ('area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'):self.stack.append(tag)
    def handle_endtag(self,tag):
        if not self.stack or self.stack[-1]!=tag:self.errors.append('Unbalanced '+tag);return
        self.stack.pop()
results=[]
files=sorted(dist.rglob('index.html'))
assert len(files)==14, 'Expected six page routes plus form confirmation in both languages'
for file in files:
    a=Audit();a.feed(file.read_text());assert not a.errors,(file,a.errors);assert not a.stack,(file,a.stack)
    assert len(a.ids)==len(set(a.ids)), 'Duplicate ids'
    assert 'lorem ipsum' not in file.read_text().lower(),file
    assert a.headings==1,(file,'Expected one primary heading')
    assert a.main_sections==(['home','intro','about','credits','portraits','screen','instagram','contact'] if a.page=='home' else [a.page]),(file,'Unexpected section order')
    if a.page in ('home','contact'):
        assert a.form_names==['portfolio-contact'],file
        assert set(a.form_fields)=={'form-name','language','bot-field','name','email','message'},file
    else:assert not a.form_names,file
    route='/'+str(file.relative_to(dist)).removesuffix('index.html')
    assert a.canonical=='https://tine-ugrin.netlify.app'+route,(file,a.canonical)
    assert a.language==('sl' if route.startswith('/sl/') else 'en'),file
    assert set(a.alternates)=={'en','sl','x-default'},file
    assert set(a.active_nav)==(set() if a.page in ('home','thanks') else {route}),(file,a.active_nav)
    assert all(link.startswith('#') if a.page=='home' else link.startswith('/') for link in a.nav_links),file
    for link in a.links:
        if link.startswith('#'):assert link[1:] in a.ids,link
        elif link.startswith('/') and not link.startswith('//'):
            target=urlsplit(link)
            path=dist/target.path.lstrip('/')
            if path.is_dir():path=path/'index.html'
            assert path.is_file(),(file,link)
            if target.fragment:
                other=Audit();other.feed(path.read_text());assert target.fragment in other.ids,(file,link)
    results.append({'page':str(file.relative_to(dist)),'sections':a.main_sections,'images':a.images,'links':len(a.links),'result':'passed'})
for script in (dist/'assets').glob('*.js'):
    for path in re.findall(r"['\"](/assets/[^'\"]+)['\"]",script.read_text()):assert (dist/path.lstrip('/')).exists(),path
for css in (dist/'assets/fonts').glob('*.css'):
    for path in re.findall(r'url\(([^)]+)\)',css.read_text()):assert (css.parent/path).exists(),path
assert 'example.com' not in (dist/'index.html').read_text()
print(json.dumps({'checks':results,'local_assets':'passed','font_assets':'passed'}))
