from pathlib import Path
import tarfile,json,hashlib
p=Path('/home/xianbei233/Work/pi-pocket-iot-thoughts');h=lambda b:hashlib.sha256(b).hexdigest()
old=p/'dist/config-ui-0.2.0-fixed/pi-pocket-iot-thoughts-0.2.0.tgz';new=p/'dist/config-ui-0.2.0-final/pi-pocket-iot-thoughts-0.2.0.tgz'
assert h(old.read_bytes())=='0f8cee40144ac4f315b7390424981d2b8510cdb345210af361d39753146f1ce4'
assert h(new.read_bytes())=='a4b1fe83dc95e6572b8aa40e94f8dc7cea4c96ced5dec66f4f60435862accfb3' and new.stat().st_size==35620
expected={'package.json','manifest.json','iot-thoughts.ts','config.example.json','README.md','LICENSE','PROVENANCE.md','docs/design.md','docs/install.md','iot-thoughts/index.js','iot-thoughts/style.css'}
def unpack(path):
 with tarfile.open(path) as a:
  ms=a.getmembers();assert len(ms)==11 and all(m.isfile() for m in ms);assert {m.name for m in ms}=={'package/'+f for f in expected};return {m.name.removeprefix('package/'):a.extractfile(m).read() for m in ms}
a=unpack(old);b=unpack(new);changed=sorted(f for f in expected if a[f]!=b[f]);assert changed==['docs/install.md','manifest.json']
assert all(b[f]==(p/f).read_bytes() for f in expected)
m=json.loads(b['manifest.json']);previous=json.loads(a['manifest.json']);assert set(m['hashes'])==expected-{'manifest.json'};assert all(h(b[f])==v for f,v in m['hashes'].items())
assert h(b['manifest.json'])=='0dd61705153f232d5e8f8e89643f5018e9413007f6b028872a9e10f08d985e13';assert h(b['docs/install.md'])=='3c9897740cf3133eaaf68c1ef6db3e0c484e2de4668df873508a755744762636'
previous['hashes']['docs/install.md']=m['hashes']['docs/install.md'];assert previous==m
runtime={f:h(b[f]) for f in ['iot-thoughts.ts','iot-thoughts/index.js','iot-thoughts/style.css']}
assert runtime=={'iot-thoughts.ts':'14cdef54b0f0584199e0005a4dceb48af9b727eb7077ec56f71ea19a6f996287','iot-thoughts/index.js':'4770e0dc86635ff9b31dbef796a1648f5acf5e33da9aac1873ecf6e754f66bf7','iot-thoughts/style.css':'0094a93f2beda4f95e4510791a4677183333b432881faecbee1510ddd045f7ff'}
print(json.dumps({'finalSha256':h(new.read_bytes()),'testedFixedSha256':h(old.read_bytes()),'finalBytes':new.stat().st_size,'exact11RegularFiles':True,'all10ManifestDigestsValid':True,'allPayloadMatchesWorkingFiles':True,'changedPayloadFilesOnly':changed,'manifestOnlyInstallDocDigestChanged':True,'runtimeByteIdentical':True,'runtimeHashes':runtime,'configOrPrivateFixturesPackaged':False},indent=2))
