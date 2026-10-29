import { writeFileSync } from 'node:fs';
import { moduleHarness,sandbox,fullSettings } from '../../../test/config-support.ts';
const b=sandbox(); const h=await moduleHarness(b.dataDir); const v=await h.call('GET','config'); let reads=0;
const body=Object.defineProperty({revision:v.revision},'settings',{enumerable:true,get(){reads++;return fullSettings({maxNodes:4});}});
let response,error;try{response=await h.call('POST','config',body);}catch(e){error=String(e);}
writeFileSync(import.meta.dirname+'/getter-observation.json',JSON.stringify({getterExecutions:reads,requestAccepted:!!response,response,error,after:await h.call('GET','config')},null,2));await h.dispose();b.cleanup();
