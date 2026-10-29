import {writeFileSync,mkdirSync,readFileSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {moduleHarness,sandbox,fullSettings} from '../../../test/config-support.ts';
const box=sandbox();const rows:unknown[]=[];
try {
 const h=await moduleHarness(box.dataDir);const initial=await h.call('GET','config');
 mkdirSync(box.directory,{mode:0o700});writeFileSync(box.file,JSON.stringify(fullSettings({maxNodes:5})),{mode:0o600});
 let error;try{await h.call('POST','config',{settings:fullSettings({maxNodes:4}),revision:initial.revision});}catch(e){error=String(e);}
 rows.push({case:'external valid file',postError:error,get:await h.call('GET','config'),disk:JSON.parse(readFileSync(box.file,'utf8'))});
 await h.dispose();let disposed;try{await h.call('GET','config');}catch(e){disposed=String(e);}
 const fresh=await moduleHarness(box.dataDir);rows.push({case:'disposed old version',oldGetError:disposed,freshGet:await fresh.call('GET','config')});
 const view=await fresh.call('GET','config');await fresh.call('POST','config',{settings:fullSettings({maxNodes:4}),revision:view.revision});const bytes=readFileSync(box.file);
 rmSync(box.file);mkdirSync(box.file);writeFileSync(join(box.file,'sentinel'),bytes);
 let failed;try{await fresh.call('POST','config',{settings:fullSettings({maxNodes:6}),revision:(await fresh.call('GET','config')).revision});}catch(e){failed=String(e);}
 const preserved=readFileSync(join(box.file,'sentinel')).equals(bytes);rmSync(box.file,{recursive:true});writeFileSync(box.file,bytes,{mode:0o600});
 rows.push({case:'unsafe target',requestError:failed,sentinelBytesPreserved:preserved,afterRestoringOriginalValidFile:await fresh.call('GET','config')});await fresh.dispose();
}finally{box.cleanup();writeFileSync(import.meta.dirname+'/contract-diagnosis.json',JSON.stringify(rows,null,2));}
