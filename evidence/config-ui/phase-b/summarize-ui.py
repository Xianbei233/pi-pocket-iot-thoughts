from pathlib import Path
import json
p=Path(__file__).parent/'ui'
def load(name):
 s=(p/name).read_text();return json.loads(s[s.index('{'):s.rindex('}')+1])
rows={}
for n in ['desktop-disabled-save.txt','mobile-compact-save-confirmed.txt','mobile-page-persistence-confirmed.txt','module-reload-readback.txt','env-locks-visible.txt','env-reset-view.txt','final-restored-view.txt','conflict-visible-refresh.txt']:
 d=load(n);v=d.get('view',{});rows[n]={'stored':v.get('stored'),'effective':v.get('effective'),'alert':d.get('alert'),'status':d.get('status')}
for n in ['tool-disabled-desktop.json','tool-mobile-compact.json','tool-restored-defaults.json']:
 d=load(n);s=''.join(x.get('text','') for x in d['content']);payload=s.split('<iot_thoughts_result>'+chr(10),1)[1].rsplit(chr(10)+'‹/iot_thoughts_result>',1)[0];d=json.loads(payload);rows[n]={'status':d['status'],'reason':d['reason'],'profile':d['profile'],'nodes':len(d['nodes'])}
(p/'verified-ui-summary.json').write_text(json.dumps(rows,indent=2));print(json.dumps(rows,ensure_ascii=False,indent=2))
