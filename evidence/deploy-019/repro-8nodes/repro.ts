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
const candidate = join(project,"dist/deploy-019/pi-pocket-iot-thoughts-0.1.0.tgz");
const prefix='支持：😀 本地笔记整理便于人工核对原始句子。\r\n反对：不向外部服务发送这批合成笔记内容。\r\n权衡：更短展示与保留全部措辞之间需要取舍。\r\n待定：是否增加更多展示选项仍然等待确认。\r\n计划：下一步由人工检查每个原文定位范围。\r\n决定：本次保留原有模型设置和扩展权限。\r\n风险：标签仅靠词法可能错误归类普通语句。\r\n中性：这些文字只用于本次无害上线验收。\r\n';
const source=prefix+'普通背景说明仅用于构造可重复的无害验收文本。\n'.repeat(22);
const params={text:source,profile:'full'};
const tags=['support','oppose','tradeoff','open','plan','decision','risk','neutral'];
const hash=(bytes: string|Buffer)=>createHash('sha256').update(bytes).digest('hex');
const save=(name:string,data:unknown)=>writeFileSync(join(evidence,name),JSON.stringify(data,null,2)+'\n');
const receipt:any={startedAt:new Date().toISOString(),stage:'isolated reproduction only',paidProviderRequests:0,invocations:[],errors:[],exitCode:1};
let app:App|undefined;
try {
    save('request.json',{prefix,backgroundLine:'普通背景说明仅用于构造可重复的无害验收文本。\n',backgroundRepeat:22,params,sourceUtf16Length:source.length,prefixUtf16Length:prefix.length,sourceUtf8Bytes:Buffer.byteLength(source),sourceUtf8Sha256:hash(source),crlfCount:(source.match(/\r\n/g)||[]).length,lfCount:(source.match(/\n/g)||[]).length});
    save('expected-tags.json',tags);
    save('baseline.json',{pocketHead:execFileSync('git',['-C','/home/xianbei233/Work/pi-pocket-production','rev-parse','HEAD'],{encoding:'utf8',timeout:10000}).trim(),pluginHead:execFileSync('git',['-C',project,'rev-parse','HEAD'],{encoding:'utf8',timeout:10000}).trim(),candidate,candidateSha256:hash(readFileSync(candidate)),candidateBytes:readFileSync(candidate).length,sourceSha256:hash(readFileSync(join(project,'iot-thoughts.ts'))),manifestSha256:hash(readFileSync(join(project,'manifest.json'))),node:process.version,configEnvPresent:process.env.PI_POCKET_IOT_THOUGHTS_CONFIG!==undefined});
    // All exact request, expectation, predicate code, baseline, and initial receipt files exist before invocation.
    save('run-receipt.json',receipt);
    if(process.env.PI_POCKET_IOT_THOUGHTS_CONFIG!==undefined) throw Error('Non-default plugin configuration present; no mutation or invocation allowed');
    const packed=execFileSync('tar',['-xOzf',candidate,'package/iot-thoughts.ts'],{timeout:10000});
    if(hash(packed)!=='b4564f4ee0a7db8a753459b97cc277a3f85ac158ecfbc55c8171cb89e9f1fdaf'||hash(readFileSync(candidate))!=='f9e2351acca07ff5f43ff49f3502ef5ca03b34d4f2a4f7ef1a24994b581c6c8b')throw Error('Candidate identity mismatch');
    let calls=0;
    const model=fauxProvider({tokensPerSecond:0,models:[{id:'faux-1',contextWindow:1000000}]});
    model.setResponses(Array.from({length:10},()=>input=>{calls++;const last=input.messages.findLast(message=>message.role!=='system');if(last?.role==='toolResult')return fauxAssistantMessage([fauxText('Synthetic result received.')]);return fauxAssistantMessage([fauxToolCall('iot_thoughts_compact',params)],{stopReason:'toolUse'});}));
    const data=join(root,'iot-exact-repro-data'); const extensions=join(data,'extensions');mkdirSync(extensions,{recursive:true});
    writeFileSync(join(extensions,'iot-thoughts.ts'),packed);
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
        receipt.invocations.push({run,toolIsError:result.isError,providerCalls:calls-before,combinedAcceptance:checks.combined,status:payload.status,reason:payload.reason,rawTextSha256:hash(text),rawTextBytes:Buffer.byteLength(text)});
        save('run-receipt.json',receipt);
    }
    const a=readFileSync(join(evidence,'run-1/raw-tool-text.txt'));const b=readFileSync(join(evidence,'run-2/raw-tool-text.txt'));
    receipt.byteIdenticalToolText=a.equals(b);receipt.exitCode=0;
} catch(error){
    const detail=error instanceof Error?{name:error.name,message:error.message,stack:error.stack}:{value:String(error)};receipt.errors.push(detail);save('exception.json',detail);receipt.exitCode=1;
} finally {
    try{await app?.close();cleanUp();receipt.isolatedCleanup=true;}catch(error){receipt.errors.push({cleanup:String(error)});receipt.exitCode=1;}
    receipt.finishedAt=new Date().toISOString();save('run-receipt.json',receipt);writeFileSync(join(evidence,'harness.exit'),String(receipt.exitCode)+'\n');
    console.log(JSON.stringify({exit:receipt.exitCode,invocations:receipt.invocations,deterministic:receipt.byteIdenticalToolText,errors:receipt.errors.length}));process.exitCode=receipt.exitCode;
}
