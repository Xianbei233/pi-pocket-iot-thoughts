// The actual Pocket helpers MUST be first. They isolate the app before it loads.
import { cleanUp, context, newSession, openApp, owner, root, say, type App } from "/home/xianbei233/Work/pi-pocket-production/test/helpers.ts";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fauxAssistantMessage, fauxProvider, fauxText, fauxToolCall } from "@earendil-works/pi-ai/providers/faux";
import { diagnose } from "./original-acceptance-logic.js";

const evidence = import.meta.dirname;
const project = "/home/xianbei233/Work/pi-pocket-iot-thoughts";
const candidate = process.env.IOT_TEST_DIST_PACKAGE;
if (!candidate) throw new Error("IOT_TEST_DIST_PACKAGE is required");
const capturedRequestBytes=readFileSync(join(project,"evidence/deploy-019/repro-8nodes/request.json"));
const capturedRequest=JSON.parse(capturedRequestBytes.toString("utf8"));
const params: {text:string;profile:"full"}=capturedRequest.params;
const source=params.text;
const tags=['support','oppose','tradeoff','open','plan','decision','risk','neutral'];
const hash=(bytes: string|Buffer)=>createHash('sha256').update(bytes).digest('hex');
const save=(name:string,data:unknown)=>writeFileSync(join(evidence,name),JSON.stringify(data,null,2)+'\n');
const receipt: {startedAt:string;stage:string;paidProviderRequests:number;invocations:{run:number;toolIsError:boolean|undefined;providerCalls:number;combinedAcceptance:boolean;status:string;reason:string;rawTextSha256:string;rawTextBytes:number;oneEach8Tags:boolean;rangeBounds:boolean}[];errors:unknown[];exitCode:number;byteIdenticalToolText?:boolean;isolatedCleanup?:boolean;finishedAt?:string}={startedAt:new Date().toISOString(),stage:'isolated reproduction only',paidProviderRequests:0,invocations:[],errors:[],exitCode:1};
let app:App|undefined;
try {
    writeFileSync(join(evidence,'request.json'),capturedRequestBytes);
    save('expected-tags.json',tags);
    save('baseline.json',{pocketHead:execFileSync('git',['-C','/home/xianbei233/Work/pi-pocket-production','rev-parse','HEAD'],{encoding:'utf8',timeout:10000}).trim(),pluginHead:execFileSync('git',['-C',project,'rev-parse','HEAD'],{encoding:'utf8',timeout:10000}).trim(),candidate,candidateSha256:hash(readFileSync(candidate)),candidateBytes:readFileSync(candidate).length,sourceSha256:hash(readFileSync(join(project,'iot-thoughts.ts'))),manifestSha256:hash(readFileSync(join(project,'manifest.json'))),node:process.version,configEnvPresent:process.env.PI_POCKET_IOT_THOUGHTS_CONFIG!==undefined});
    const expectedPocketHead=process.env.IOT_TEST_POCKET_HEAD;
    const actualPocketHead=execFileSync('git',['-C','/home/xianbei233/Work/pi-pocket-production','rev-parse','HEAD'],{encoding:'utf8',timeout:10000}).trim();
    if(!expectedPocketHead||actualPocketHead!==expectedPocketHead)throw Error('Pocket baseline mismatch');
    // All exact request, expectation, predicate code, baseline, and initial receipt files exist before invocation.
    save('run-receipt.json',receipt);
    if(process.env.PI_POCKET_IOT_THOUGHTS_CONFIG!==undefined) throw Error('Non-default plugin configuration present; no mutation or invocation allowed');
    if(source.length!==684||hash(source)!=='eaaf9735e58cd8c007f42da892b2ba391795e1b752def522d5fb8d68695b6c2e'||params.profile!=='full')throw Error('Exact request identity mismatch');
    const packed=execFileSync('tar',['-xOzf',candidate,'package/iot-thoughts.ts'],{timeout:10000});
    if(hash(packed)!=='14cdef54b0f0584199e0005a4dceb48af9b727eb7077ec56f71ea19a6f996287'||hash(readFileSync(candidate))!=='0f8cee40144ac4f315b7390424981d2b8510cdb345210af361d39753146f1ce4')throw Error('Candidate identity mismatch');
    let calls=0;
    const model=fauxProvider({tokensPerSecond:0,models:[{id:'faux-1',contextWindow:1000000}]});
    model.setResponses(Array.from({length:10},()=>input=>{calls++;const last=input.messages.findLast(message=>message.role!=='system');if(last?.role==='toolResult')return fauxAssistantMessage([fauxText('Synthetic result received.')]);return fauxAssistantMessage([fauxToolCall('iot_thoughts_compact',params)],{stopReason:'toolUse'});}));
    const data=join(root,'iot-exact-repro-data'); const extensions=join(data,'extensions');mkdirSync(extensions,{recursive:true});
    writeFileSync(join(extensions,'iot-thoughts.ts'),packed);
    mkdirSync(join(extensions,'iot-thoughts'));
    for(const name of ['index.js','style.css'])writeFileSync(join(extensions,'iot-thoughts',name),execFileSync('tar',['-xOzf',candidate,'package/iot-thoughts/'+name],{timeout:10000}));
    app=await openApp(model,data);
    save('loader-initial.json',(await app.extensions(owner(app))).modules.filter(m=>m.file==='iot-thoughts.ts'));
    await app.setExtensionEnabled(owner(app),'iot-thoughts.ts',true);
    const enabled=(await app.extensions(owner(app))).modules.filter(m=>m.file==='iot-thoughts.ts');save('loader-enabled.json',enabled);
    if(enabled.length!==1||enabled[0]?.error)throw Error('Real loader did not enable candidate cleanly');
    for(let run=1;run<=2;run++){
        const dir='run-'+run;mkdirSync(join(evidence,dir),{recursive:true});
        save(dir+'/invocation-before.json',{run,params,startedAt:new Date().toISOString(),callsBefore:calls});
        const before=calls;const id=await newSession(app);
        await say(app,id,'Please organize the exact supplied synthetic visible notes.');
        const view=await (await app.harness.conversation(id,context))!.context(context);
        const result=view.messages.findLast(message=>message.role==='toolResult');
        // Persist the complete backend result BEFORE parsing or evaluating any acceptance condition.
        save(dir+'/raw-tool-return.json',result??null);
        if(!result||result.role!=='toolResult')throw Error('No backend toolResult');
        const text=result.content.filter(part=>part.type==='text').map(part=>part.text).join('');
        writeFileSync(join(evidence,dir,'raw-tool-text.txt'),text);
        save(dir+'/tool-call.json',view.messages.filter(message=>message.role==='assistant'));
        const match=/<iot_thoughts_result>\n([\s\S]*)\n‹\/iot_thoughts_result>/.exec(text);
        if(!match)throw Error('No complete result JSON fence');
        const payload=JSON.parse(match[1]);save(dir+'/parsed.json',payload);
        const checks=diagnose(source,payload,tags);save(dir+'/per-condition.json',checks);
        receipt.invocations.push({run,toolIsError:result.isError,providerCalls:calls-before,combinedAcceptance:checks.combined,status:payload.status,reason:payload.reason,rawTextSha256:hash(text),rawTextBytes:Buffer.byteLength(text),oneEach8Tags:tags.every(tag=>checks.actualCounts[tag]===1),rangeBounds:checks.ranges.every(node=>node.integers&&node.inBounds)});
        save('run-receipt.json',receipt);
    }
    const a=readFileSync(join(evidence,'run-1/raw-tool-text.txt'));const b=readFileSync(join(evidence,'run-2/raw-tool-text.txt'));
    receipt.byteIdenticalToolText=a.equals(b);
    const acceptance=receipt.byteIdenticalToolText&&receipt.invocations.length===2&&receipt.invocations.every(run=>run.combinedAcceptance&&run.oneEach8Tags&&run.rangeBounds&&run.toolIsError===false&&run.providerCalls===2);
    save('acceptance-summary.json',{pass:acceptance,byteIdentical:receipt.byteIdenticalToolText,invocations:receipt.invocations});
    writeFileSync(join(evidence,'acceptance.exit'),acceptance?'0\n':'1\n');
    receipt.exitCode=acceptance?0:1;
} catch(error){
    const detail=error instanceof Error?{name:error.name,message:error.message,stack:error.stack}:{value:String(error)};receipt.errors.push(detail);save('exception.json',detail);receipt.exitCode=1;
} finally {
    try{await app?.close();cleanUp();receipt.isolatedCleanup=true;}catch(error){receipt.errors.push({cleanup:String(error)});receipt.exitCode=1;}
    receipt.finishedAt=new Date().toISOString();save('run-receipt.json',receipt);writeFileSync(join(evidence,'harness.exit'),String(receipt.exitCode)+'\n');
    console.log(JSON.stringify({exit:receipt.exitCode,invocations:receipt.invocations,deterministic:receipt.byteIdenticalToolText,errors:receipt.errors.length}));process.exitCode=receipt.exitCode;
}
