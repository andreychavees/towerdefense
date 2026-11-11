#!/usr/bin/env python3
"""Bundle the game and local images into one HTML file, without dependencies."""
import base64
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
html = (root / 'gatos-vs-minhoca.html').read_text()
motion = (root / 'motion.js').read_text()
html = html.replace('<script src="motion.js"></script>', '<script>\n' + motion + '\n</script>')
images = {
    p.relative_to(root).as_posix(): 'data:image/png;base64,' + base64.b64encode(p.read_bytes()).decode('ascii')
    for p in sorted((root / 'assets/art').glob('*.png'))
}
html = html.replace('<script>\nconst cv=', '<script>\nconst EMBEDDED_ART=' + json.dumps(images, separators=(',', ':')) + ';\nconst cv=', 1)
html = html.replace('im.src=src;', 'im.src=EMBEDDED_ART[src]||src;')
output = root / 'dist/gatos-vs-minhoca-jogar.html'
output.parent.mkdir(exist_ok=True)
output.write_text(html)
print(f'{output}: {output.stat().st_size / 1024 / 1024:.1f} MiB; {len(images)} imagens incorporadas')
