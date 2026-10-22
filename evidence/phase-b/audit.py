import pathlib,tarfile,hashlib,json
p=pathlib.Path('.')
tar=p/'dist/pi-pocket-iot-thoughts-0.1.0.tgz'
sha=lambda b:hashlib.sha256(b).hexdigest()
expected=['LICENSE','PROVENANCE.md','README.md','config.example.json','docs/design.md','docs/install.md','iot-thoughts.ts','manifest.json','package.json']
assert sha(tar.read_bytes())=='81d214458a2661ac541e74ef97752c2571715bc503caa74c7b8aa609f11b3689'
assert tar.stat().st_size==22497
with tarfile.open(tar,'r:gz') as tf:
    members=tf.getmembers()
    assert sorted(x.name for x in members)==['package/'+x for x in sorted(expected)]
    assert all(x.isfile() and not x.issym() and not x.islnk() for x in members)
    data={x.name.removeprefix('package/'):tf.extractfile(x).read() for x in members}
m=json.loads(data['manifest.json'])
assert sorted(m['hashes'])==sorted(x for x in expected if x!='manifest.json')
for name,digest in m['hashes'].items(): assert sha(data[name])==digest,name
for name in expected: assert data[name]==(p/name).read_bytes(),name
assert sha(data['iot-thoughts.ts'])=='4b6673a00ad9b1c79f265f4565c8bed6e11cdb23996f896b687cfe774c1d8fdd'
r={'dist':str(tar),'distSha256':sha(tar.read_bytes()),'bytes':tar.stat().st_size,'files':expected,'count':len(members),'allRegular':True,'payloadEqualsCheckout':True,'manifestDigestsAll8Verified':True,'manifestSha256':sha(data['manifest.json']),'sourceSha256':sha(data['iot-thoughts.ts']),'allPayloadSha256':{k:sha(v) for k,v in sorted(data.items())}}
(p/'evidence/phase-b/dist-audit.json').write_text(json.dumps(r,indent=2)+'\n')
prior={'test/core.test.ts':'a132e526ebc87d72bf9e626fbb0bfc6ae719b9e34cdc362cf4ad973fa31c9e63','test/factory.test.ts':'6b8d50289e8719b28de09d0a59425926a75e70e34eb7b430ae3a08b80f4f7c83'}
u={}
for name in ['test/core.test.ts','test/factory.test.ts','test/regressions.test.ts']:
    current=sha((p/name).read_bytes())
    u[name]={'sha256':current,'phaseBTesterModified':False,'priorRecordedTerminalDigest':prior.get(name),'digestComparison':current==prior[name] if name in prior else 'no persisted phase-A final digest available'}
    if name in prior: assert current==prior[name],name
(p/'evidence/phase-b/original-regressions-unchanged.json').write_text(json.dumps(u,indent=2)+chr(10))
print(json.dumps({'dist':r,'originalRegressions':u},indent=2))
