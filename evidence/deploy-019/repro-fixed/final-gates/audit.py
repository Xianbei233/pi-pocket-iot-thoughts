import pathlib,json,hashlib,tarfile,subprocess
p=pathlib.Path('/home/xianbei233/Work/pi-pocket-iot-thoughts'); e=pathlib.Path(__file__).parent
h=lambda b:hashlib.sha256(b).hexdigest()
run=lambda *a:subprocess.check_output(a,text=True)
t=p/'dist/deploy-019-negation/pi-pocket-iot-thoughts-0.1.0.tgz'
assert t.stat().st_size==22672 and h(t.read_bytes())=='31237760ab17934878dc21c338fe4a417541e0eefdaedcc25270cb1a5af3464e'
assert run('git','-C','/home/xianbei233/Work/pi-pocket-production','rev-parse','HEAD').strip()=='eae8ccf6c615ea2188f9b88e9252455917b081d4'
expected={'package.json','manifest.json','iot-thoughts.ts','config.example.json','README.md','PROVENANCE.md','LICENSE','docs/design.md','docs/install.md'}
with tarfile.open(t) as a:
    ms=a.getmembers(); assert len(ms)==9 and all(x.isfile() for x in ms)
    assert {x.name for x in ms}=={'package/'+x for x in expected}
    data={x.name.removeprefix('package/'):a.extractfile(x).read() for x in ms}
assert all(data[n]==(p/n).read_bytes() for n in expected)
m=json.loads(data['manifest.json']); assert set(m['hashes'])==expected-{'manifest.json'}
assert all(h(data[n])==v for n,v in m['hashes'].items())
assert h(data['iot-thoughts.ts'])=='cc254c7925958797c25961bfeceb857b13d958d00cb00bd23f4b489ac0a67ed4'
assert h(data['manifest.json'])=='1525899983a0c210f421e4e81ea1a9b06e268cb85afbba816c1465f7edca0fca'
old=run('git','show','HEAD:test/regressions.test.ts'); new=(p/'test/regressions.test.ts').read_text()
imports='import { createHash } from "node:crypto";'+chr(10)+'import { mkdirSync, writeFileSync } from "node:fs";'+chr(10)+'import { join } from "node:path";'+chr(10)
prior=new.split('// Exact request copied from evidence/deploy-019/repro-8nodes/request.json.')[0].replace(imports,'').rstrip()+chr(10)
assert prior==old
assert (e/'original-acceptance-logic.js').read_bytes()==(p/'evidence/deploy-019/repro-8nodes/original-acceptance-logic.js').read_bytes()
assert (e.parent/'request.json').read_bytes()==(p/'evidence/deploy-019/repro-8nodes/request.json').read_bytes()
for f in ['test/core.test.ts','test/packaging.test.ts','test/pocket-integration.test.ts']:
    assert (p/f).read_text()==run('git','show','HEAD:'+f)
assert (p/'test/factory.test.ts').read_text()==run('git','show','HEAD:test/factory.test.ts').replace('result.content','result.output')
with tarfile.open(p/'dist/deploy-019/pi-pocket-iot-thoughts-0.1.0.tgz') as a: oldSource=a.extractfile('package/iot-thoughts.ts').read().decode()
newSource=data['iot-thoughts.ts'].decode()
comment='/**'+chr(10)+' * A negation marker. The bare marker '+chr(96)+'无'+chr(96)+' does not count inside '+chr(96)+'无害'+chr(96)+'; every other '+chr(96)+'无'+chr(96)+' and every other negation in the'+chr(10)+' * same sentence still counts. This is a narrow lexical exception, not a semantic classifier.'+chr(10)+' */'+chr(10)
assert newSource.replace(comment,'').replace('|无(?!害)|','|无|')==oldSource
for f in ['evidence/phase-a-added-cases.tmp','evidence/phase-a-preserved/phase-a-added-cases.tmp']:
    assert h((p/f).read_bytes())=='b27fb3444cbaf19c483b796ae853cf0466616abcd20724c11797ff867904b4ca'
diff=run('git','diff','--','iot-thoughts.ts')
(e/'source-diff.txt').write_text(diff)
print(json.dumps({'candidateSha256':h(t.read_bytes()),'size':t.stat().st_size,'exact9RegularFiles':True,'all8ManifestDigestsValid':True,'sourceSha256':h(data['iot-thoughts.ts']),'manifestSha256':h(data['manifest.json']),'sourceDiffSha256':h(diff.encode()),'onlyNegationAndCommentChangedSinceAdaptedCandidate':True,'originalRegressionBodyPreserved':True,'originalOtherTestsPreserved':True,'originalPredicateBytesPreserved':True,'originalRequestBytesPreserved':True,'originalCases':45,'addedCases':11,'expectedTotalCases':56,'tmpPreserved':True},indent=2))
