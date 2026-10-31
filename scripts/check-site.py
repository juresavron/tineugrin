from pathlib import Path
from html.parser import HTMLParser
import re,json

root=Path(__file__).resolve().parent.parent
dist=root/'dist'
class Audit(HTMLParser):
    def __init__(self):super().__init__();self.ids=[];self.links=[];self.keys=[];self.errors=[];self.stack=[];self.images=0
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
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
for file in [dist/'index.html',dist/'sl/index.html']:
    a=Audit();a.feed(file.read_text());assert not a.errors,(file,a.errors);assert not a.stack,(file,a.stack)
    assert len(a.ids)==len(set(a.ids)), 'Duplicate ids'
    for link in a.links:
        if link.startswith('#'):assert link[1:] in a.ids,link
        elif link.startswith('/') and not link.startswith('//'):
            path=dist/link.split('#')[0].lstrip('/')
            assert path.exists(),(file,link)
    results.append({'page':str(file.relative_to(dist)),'images':a.images,'links':len(a.links),'result':'passed'})
for script in (dist/'assets').glob('*.js'):
    for path in re.findall(r"['\"](/assets/[^'\"]+)['\"]",script.read_text()):assert (dist/path.lstrip('/')).exists(),path
for css in (dist/'assets/fonts').glob('*.css'):
    for path in re.findall(r'url\(([^)]+)\)',css.read_text()):assert (css.parent/path).exists(),path
assert 'example.com' not in (dist/'index.html').read_text()
print(json.dumps({'checks':results,'local_assets':'passed','font_assets':'passed'}))
