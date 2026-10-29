import pathlib,tarfile,json,hashlib
p=pathlib.Path('/home/xianbei233/Work/pi-pocket-iot-thoughts');t=p/'dist/config-ui-0.2.0/pi-pocket-iot-thoughts-0.2.0.tgz';h=lambda b:hashlib.sha256(b).hexdigest()
expected={'package.json','manifest.json','iot-thoughts.ts','config.example.json','README.md','LICENSE','PROVENANCE.md','docs/design.md','docs/install.md','iot-thoughts/index.js','iot-thoughts/style.css'}
assert t.stat().st_size==33337 and h(t.read_bytes())=='db5d2685cb77b070add5351f721ed02c56bcfa7c476ad5b34d7021f965e3a6db'
with tarfile.open(t) as a:
 ms=a.getmembers();assert len(ms)==11 and all(m.isfile() for m in ms);assert {m.name for m in ms}=={'package/'+f for f in expected};data={m.name.removeprefix('package/'):a.extractfile(m).read() for m in ms}
m=json.loads(data['manifest.json']);assert set(m['hashes'])==expected-{'manifest.json'};assert all(h(data[f])==v for f,v in m['hashes'].items());assert all(data[f]==(p/f).read_bytes() for f in expected)
for f,sha in {'iot-thoughts.ts':'f46361712783ba9274076ce858d608dcf3f4fed04712043ab93a04cbe2607713','manifest.json':'0cd324ef4d6de0560e1d58c679ec693abb035470e7b0154d2a3ced1174d0a219','iot-thoughts/index.js':'cea5a0752f5ffed55d72b02af75fc0b5bcd4b9c2ae0b36985ae071ce6facf9b2','iot-thoughts/style.css':'0094a93f2beda4f95e4510791a4677183333b432881faecbee1510ddd045f7ff'}.items(): assert h(data[f])==sha
for f in ['test/core.test.ts','test/regressions.test.ts']: assert (p/f).read_bytes()==(p/'evidence/config-ui/baseline'/pathlib.Path(f).name).read_bytes()
print(json.dumps({'candidateSha256':h(t.read_bytes()),'bytes':t.stat().st_size,'exact11RegularFiles':True,'all10ManifestDigestsValid':True,'clientHashesValid':True,'allPayloadEqualsWorkingFiles':True,'coreRegressionBytesPreserved':True,'configNotPackaged':True},indent=2))
