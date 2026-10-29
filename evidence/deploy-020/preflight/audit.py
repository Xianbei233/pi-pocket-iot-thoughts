import pathlib,json,hashlib,tarfile,subprocess,sys
p=pathlib.Path('/home/xianbei233/Work/pi-pocket-iot-thoughts');e=pathlib.Path(__file__).parent
h=lambda b:hashlib.sha256(b).hexdigest()
run=lambda *a:subprocess.check_output(a,text=True)
def snapshot():
 files=run('git','-C',str(p),'ls-files','-z').split('\0')
 hashes={f:h((p/f).read_bytes()) for f in files if f and (p/f).is_file()}
 for f in ['evidence/phase-a-added-cases.tmp','evidence/phase-a-preserved/phase-a-added-cases.tmp','dist/deploy-019-negation/pi-pocket-iot-thoughts-0.1.0.tgz']:
  hashes[f]=h((p/f).read_bytes())
 dictionary=pathlib.Path('/home/xianbei233/.pi-pocket/extensions/zh-cn-ui.ts')
 return {'trackedAndPreservedHashes':hashes,'workingDiffSha256':h(run('git','-C',str(p),'diff','--binary').encode()),'dictionarySha256':h(dictionary.read_bytes()),'pocketHead':run('git','-C','/home/xianbei233/Work/pi-pocket-production','rev-parse','HEAD').strip(),'pocketStatus':run('git','-C','/home/xianbei233/Work/pi-pocket-production','status','--porcelain=v1')}
if sys.argv[1]=='before':
 s=snapshot();assert s['pocketHead']=='d1b97e1d995742dae90b20bcd1ce9545fdfc58c5' and not s['pocketStatus'];assert s['dictionarySha256']=='15a0ceb363d92c7d0fc2b75c89a13f88e101285aa417db85039857aeda8e965e';(e/'preservation-before.json').write_text(json.dumps(s,indent=2));print('Baseline and hash-only dictionary check pass')
else:
 before=json.loads((e/'preservation-before.json').read_text());after=snapshot();(e/'preservation-after.json').write_text(json.dumps(after,indent=2));assert before==after
 t=p/'dist/deploy-019-negation/pi-pocket-iot-thoughts-0.1.0.tgz';assert t.stat().st_size==22672 and h(t.read_bytes())=='31237760ab17934878dc21c338fe4a417541e0eefdaedcc25270cb1a5af3464e'
 expected={'package.json','manifest.json','iot-thoughts.ts','config.example.json','README.md','PROVENANCE.md','LICENSE','docs/design.md','docs/install.md'}
 with tarfile.open(t) as a:
  ms=a.getmembers();assert len(ms)==9 and all(x.isfile() for x in ms);assert {x.name for x in ms}=={'package/'+x for x in expected};data={x.name.removeprefix('package/'):a.extractfile(x).read() for x in ms}
 assert all(data[n]==(p/n).read_bytes() for n in expected)
 m=json.loads(data['manifest.json']);assert set(m['hashes'])==expected-{'manifest.json'};assert all(h(data[n])==v for n,v in m['hashes'].items())
 assert h(data['iot-thoughts.ts'])=='cc254c7925958797c25961bfeceb857b13d958d00cb00bd23f4b489ac0a67ed4';assert h(data['manifest.json'])=='1525899983a0c210f421e4e81ea1a9b06e268cb85afbba816c1465f7edca0fca'
 assert (e/'original-acceptance-logic.js').read_bytes()==(p/'evidence/deploy-019/repro-8nodes/original-acceptance-logic.js').read_bytes();assert (e/'request.json').read_bytes()==(p/'evidence/deploy-019/repro-8nodes/request.json').read_bytes()
 print(json.dumps({'candidateSha256':h(t.read_bytes()),'size':t.stat().st_size,'exact9RegularFiles':True,'manifestAll8DigestsValid':True,'allPayloadEqualsWorkingFiles':True,'pocketHead':after['pocketHead'],'pocketClean':not after['pocketStatus'],'workingTreeAndTrackedFilesUnchanged':True,'dictionaryHashUnchanged':True,'dictionarySha256':after['dictionarySha256'],'requestAndPredicateBytesUnchanged':True,'manifestHistoricalVerifiedWith':m['verifiedWith'],'external020EvidenceOnly':True},indent=2))
