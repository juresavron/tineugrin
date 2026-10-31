from pathlib import Path
import subprocess,sys

root=Path(__file__).resolve().parent.parent
source=(root/'src/index.html').read_text()
for name in ('credits-rail','screen-section','casting-file'):
    marker='<!-- component:'+name+' -->'
    assert source.count(marker)==1, 'Missing or repeated component: '+name
    source=source.replace(marker,(root/'components'/f'{name}.html').read_text().strip())
(root/'dist/index.html').write_text(source)
subprocess.run([sys.executable,str(root/'scripts/localize.py')],cwd=root,check=True)
