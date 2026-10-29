import pathlib,tarfile,json,hashlib
p=pathlib.Path('/home/xianbei233/Work/pi-pocket-iot-thoughts');t=p/'dist/config-ui-0.2.0-fixed/pi-pocket-iot-thoughts-0.2.0.tgz';h=lambda b:hashlib.sha256(b).hexdigest()
expected={'package.json','manifest.json','iot-thoughts.ts','config.example.json','README.md','LICENSE','PROVENANCE.md','docs/design.md','docs/install.md','iot-thoughts/index.js','iot-thoughts/style.css'}
assert t.stat().st_size==35548 and h(t.read_bytes())=='0f8cee40144ac4f315b7390424981d2b8510cdb345210af361d39753146f1ce4'
with tarfile.open(t) as a:
 ms=a.getmembers();assert len(ms)==11 and all(m.isfile() for m in ms);assert {m.name for m in ms}=={'package/'+f for f in expected};data={m.name.removeprefix('package/'):a.extractfile(m).read() for m in ms}
m=json.loads(data['manifest.json']);assert set(m['hashes'])==expected-{'manifest.json'};assert all(h(data[f])==v for f,v in m['hashes'].items());assert all(data[f]==(p/f).read_bytes() for f in expected)
for f,sha in {'iot-thoughts.ts':'14cdef54b0f0584199e0005a4dceb48af9b727eb7077ec56f71ea19a6f996287','manifest.json':'49ea87dddf3963946f7c51e899de6023c62e7827d87e97eea814b885c340f7d5','iot-thoughts/index.js':'4770e0dc86635ff9b31dbef796a1648f5acf5e33da9aac1873ecf6e754f66bf7','iot-thoughts/style.css':'0094a93f2beda4f95e4510791a4677183333b432881faecbee1510ddd045f7ff'}.items(): assert h(data[f])==sha
for f in ['test/core.test.ts','test/regressions.test.ts']: assert (p/f).read_bytes()==(p/'evidence/config-ui/baseline'/pathlib.Path(f).name).read_bytes()
print(json.dumps({'candidateSha256':h(t.read_bytes()),'bytes':t.stat().st_size,'exact11RegularFiles':True,'all10ManifestDigestsValid':True,'clientHashesValid':True,'allPayloadEqualsWorkingFiles':True,'coreRegressionBytesPreserved':True,'configNotPackaged':True},indent=2))
