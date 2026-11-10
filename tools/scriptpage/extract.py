"""진행 대본(hwpx)에서 내용을 뽑아 script.json으로 저장한다. 표·문단의 글자 서식(말하는 사람·지시·참고·채울 곳·강조)을 대본 표기로 되살린다.

  python tools/scriptpage/extract.py <대본.hwpx>   → tools/scriptpage/script.json
대본은 월드 밖(OneDrive 진행대본 폴더)에 있다. hwpx를 고친 뒤 다시 뽑고 build.py를 돌린다.
표기: "# " 빨간 굵은 소제목, "## " 굵은 소제목, "> " 무대·화면 지시, "※" 참고, "- " / "  - " 글머리, "사회: " 등 말하는 사람, [ ] 채울 곳, { } 강조
"""
import sys, os, zipfile, json, re
import xml.etree.ElementTree as ET
HP='{http://www.hancom.co.kr/hwpml/2011/paragraph}'
src = sys.argv[1]
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "script.json")
root = ET.fromstring(zipfile.ZipFile(src).read('Contents/section0.xml'))
SPK = ('사회', '해설', '캐스터', '선수', '관객')
BOLD = {'9', '30'}; RED_B = '26'; RED = {'25', '32'}; BLUE = {'27', '31'}
def runs(p):
    return [(r.get('charPrIDRef'), ''.join(t.text or '' for t in r.findall(HP+'t'))) for r in p.findall(HP+'run') if r.find(HP+'t') is not None]
def line(p):
    rs = [(c, t) for c, t in runs(p) if t]
    ppr = p.get('paraPrIDRef')
    if not rs: return ''
    txt = ''.join(t for _, t in rs)
    cs = {c for c, _ in rs}
    if ppr == '27': return '- ' + render(rs)[2:] if render(rs).startswith('· ') else '- ' + render(rs)
    if ppr == '28': r = render(rs); return '  - ' + (r[2:] if r.startswith('– ') else r)
    if cs == {RED_B}: return '# ' + txt
    if cs <= RED: return '> ' + txt
    if cs <= BLUE and txt.startswith('※'): return txt
    if cs <= BOLD:
        m = re.match(r'^(%s): $' % '|'.join(SPK), txt)
        if not m: return '## ' + txt
    first_c, first_t = rs[0]
    m = re.match(r'^(%s): $' % '|'.join(SPK), first_t)
    if first_c in BOLD and m: return m.group(1) + ': ' + render(rs[1:])
    return render(rs)
def render(rs):
    o = ''
    for c, t in rs:
        if c in BOLD: o += '{' + t + '}'
        else: o += t   # 파란 [ ]는 글자 안에 괄호가 이미 있다
    return o
def cell_lines(tc):
    return [line(p) for p in tc.find(HP+'subList').findall(HP+'p')]
def table(tbl):
    rows = []
    for tr in tbl.findall(HP+'tr'):
        row = []
        for tc in tr.findall(HP+'tc'):
            a = tc.find(HP+'cellAddr'); s = tc.find(HP+'cellSpan')
            row.append({'c': int(a.get('colAddr')), 'r': int(a.get('rowAddr')), 'rs': int(s.get('rowSpan')), 'cs': int(s.get('colSpan')),
                        'bf': tc.get('borderFillIDRef'), 'lines': cell_lines(tc)})
        rows.append(row)
    return {'cols': int(tbl.get('colCnt')), 'rows': rows}
doc = []
for p in root.findall(HP+'p'):
    tbls = p.findall('.//'+HP+'tbl')
    if tbls:
        for t in tbls: doc.append({'type': 'table', **table(t)})
        continue
    rs = [(c, t) for c, t in runs(p) if t]
    if not rs: continue
    ppr = p.get('paraPrIDRef'); txt = ''.join(t for _, t in rs); cs = {c for c, _ in rs}
    kind = 'title' if ppr == '21' else 'right' if ppr == '22' else 'h1' if (ppr == '12' and cs == {'14'}) else 'h2' if (ppr == '12' and cs <= BOLD) else 'text'
    doc.append({'type': kind, 'text': txt if kind != 'text' else line(p)})
json.dump(doc, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(doc), 'blocks', [d['type'] for d in doc][:40])
