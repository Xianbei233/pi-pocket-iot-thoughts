// Prepared only. Run once ONLY after explicit planner authorization.
// @options: {"max_output_tokens": 2000}
const dir="/home/xianbei233/Work/pi-pocket-iot-thoughts/evidence/deploy-019/production-retry/";
const requestBytes="{\n  \"prefix\": \"支持：😀 本地笔记整理便于人工核对原始句子。\\r\\n反对：不向外部服务发送这批合成笔记内容。\\r\\n权衡：更短展示与保留全部措辞之间需要取舍。\\r\\n待定：是否增加更多展示选项仍然等待确认。\\r\\n计划：下一步由人工检查每个原文定位范围。\\r\\n决定：本次保留原有模型设置和扩展权限。\\r\\n风险：标签仅靠词法可能错误归类普通语句。\\r\\n中性：这些文字只用于本次无害上线验收。\\r\\n\",\n  \"backgroundLine\": \"普通背景说明仅用于构造可重复的无害验收文本。\\n\",\n  \"backgroundRepeat\": 22,\n  \"params\": {\n    \"text\": \"支持：😀 本地笔记整理便于人工核对原始句子。\\r\\n反对：不向外部服务发送这批合成笔记内容。\\r\\n权衡：更短展示与保留全部措辞之间需要取舍。\\r\\n待定：是否增加更多展示选项仍然等待确认。\\r\\n计划：下一步由人工检查每个原文定位范围。\\r\\n决定：本次保留原有模型设置和扩展权限。\\r\\n风险：标签仅靠词法可能错误归类普通语句。\\r\\n中性：这些文字只用于本次无害上线验收。\\r\\n普通背景说明仅用于构造可重复的无害验收文本。\\n普通背景说明仅用于构造可重复的无害验收文本。\\n普通背景说明仅用于构造可重复的无害验收文本。\\n普通背景说明仅用于构造可重复的无害验收文本。\\n普通背景说明仅用于构造可重复的无害验收文本。\\n普通背景说明仅用于构造可重复的无害验收文本。\\n普通背景说明仅用于构造可重复的无害验收文本。\\n普通背景说明仅用于构造可重复的无害验收文本。\\n普通背景说明仅用于构造可重复的无害验收文本。\\n普通背景说明仅用于构造可重复的无害验收文本。\\n普通背景说明仅用于构造可重复的无害验收文本。\\n普通背景说明仅用于构造可重复的无害验收文本。\\n普通背景说明仅用于构造可重复的无害验收文本。\\n普通背景说明仅用于构造可重复的无害验收文本。\\n普通背景说明仅用于构造可重复的无害验收文本。\\n普通背景说明仅用于构造可重复的无害验收文本。\\n普通背景说明仅用于构造可重复的无害验收文本。\\n普通背景说明仅用于构造可重复的无害验收文本。\\n普通背景说明仅用于构造可重复的无害验收文本。\\n普通背景说明仅用于构造可重复的无害验收文本。\\n普通背景说明仅用于构造可重复的无害验收文本。\\n普通背景说明仅用于构造可重复的无害验收文本。\\n\",\n    \"profile\": \"full\"\n  },\n  \"sourceUtf16Length\": 684,\n  \"prefixUtf16Length\": 178,\n  \"sourceUtf8Bytes\": 1972,\n  \"sourceUtf8Sha256\": \"eaaf9735e58cd8c007f42da892b2ba391795e1b752def522d5fb8d68695b6c2e\",\n  \"crlfCount\": 8,\n  \"lfCount\": 30\n}\n";
const request=JSON.parse(requestBytes);
const expectedTags=['support','oppose','tradeoff','open','plan','decision','risk','neutral'];
// Reconstructed from the Owner's supplied original combined predicate. No acceptance standard is changed.
function diagnose(source, payload, expectedTags) {
    const nodes = Array.isArray(payload.nodes) ? payload.nodes : [];
    const counts = Object.fromEntries(expectedTags.map(tag => [tag, nodes.filter(node => node.tag === tag).length]));
    const ranges = nodes.map((node, index) => ({index, tag:node.tag, sourceTag:node.sourceTag, start:node.start, end:node.end, text:node.text, integers:Number.isInteger(node.start)&&Number.isInteger(node.end), inBounds:node.start>=0&&node.end<=source.length&&node.start<node.end, sourceSlice:source.slice(node.start,node.end), grounded:source.slice(node.start,node.end)===node.text, containsEmoji:node.text.includes('😀')}));
    const conditions = {statusCompacted:payload.status==='compacted', nodeCount8:nodes.length===8, all8Tags:expectedTags.every(tag=>nodes.some(node=>node.tag===tag)), allGrounded:nodes.every(node=>source.slice(node.start,node.end)===node.text), emojiNode:nodes.some(node=>node.text.includes('😀')), falseVerified:payload.verified===false, shorter:typeof payload.text==='string'&&payload.text.length<source.trim().length};
    const combined = conditions.statusCompacted && conditions.nodeCount8 && conditions.all8Tags && conditions.allGrounded && conditions.emojiNode && conditions.falseVerified && conditions.shorter;
    return {conditions, combined, expectedTags, expectedCounts:Object.fromEntries(expectedTags.map(tag=>[tag,1])), actualCounts:counts, actualTags:nodes.map(node=>node.tag), missingTags:expectedTags.filter(tag=>counts[tag]===0), nodeCount:nodes.length, status:payload.status, reason:payload.reason, ranges, sourceUtf16Length:source.length, sourceTrimmedUtf16Length:source.trim().length, resultUtf16Length:payload.text?.length, exactKeptSource:payload.text===source};
}

const receipt={startedAt:new Date().toISOString(),authorizedOneCall:true,candidateSha256:'31237760ab17934878dc21c338fe4a417541e0eefdaedcc25270cb1a5af3464e',sourceSha256:'cc254c7925958797c25961bfeceb857b13d958d00cb00bd23f4b489ac0a67ed4',requestSha256:'eaaf9735e58cd8c007f42da892b2ba391795e1b752def522d5fb8d68695b6c2e',requestUtf16Length:request.params.text.length,callCount:0,status:'not started',rawDurable:false,errors:[]};
const save=async(name,value)=>tools.write({path:dir+name,content:typeof value==='string'?value:JSON.stringify(value,null,2)+'\n'});
try {
  await save('request.json',requestBytes);
  await save('original-acceptance-logic.js',"// Reconstructed from the Owner's supplied original combined predicate. No acceptance standard is changed.\nexport function diagnose(source, payload, expectedTags) {\n    const nodes = Array.isArray(payload.nodes) ? payload.nodes : [];\n    const counts = Object.fromEntries(expectedTags.map(tag => [tag, nodes.filter(node => node.tag === tag).length]));\n    const ranges = nodes.map((node, index) => ({index, tag:node.tag, sourceTag:node.sourceTag, start:node.start, end:node.end, text:node.text, integers:Number.isInteger(node.start)&&Number.isInteger(node.end), inBounds:node.start>=0&&node.end<=source.length&&node.start<node.end, sourceSlice:source.slice(node.start,node.end), grounded:source.slice(node.start,node.end)===node.text, containsEmoji:node.text.includes('😀')}));\n    const conditions = {statusCompacted:payload.status==='compacted', nodeCount8:nodes.length===8, all8Tags:expectedTags.every(tag=>nodes.some(node=>node.tag===tag)), allGrounded:nodes.every(node=>source.slice(node.start,node.end)===node.text), emojiNode:nodes.some(node=>node.text.includes('😀')), falseVerified:payload.verified===false, shorter:typeof payload.text==='string'&&payload.text.length<source.trim().length};\n    const combined = conditions.statusCompacted && conditions.nodeCount8 && conditions.all8Tags && conditions.allGrounded && conditions.emojiNode && conditions.falseVerified && conditions.shorter;\n    return {conditions, combined, expectedTags, expectedCounts:Object.fromEntries(expectedTags.map(tag=>[tag,1])), actualCounts:counts, actualTags:nodes.map(node=>node.tag), missingTags:expectedTags.filter(tag=>counts[tag]===0), nodeCount:nodes.length, status:payload.status, reason:payload.reason, ranges, sourceUtf16Length:source.length, sourceTrimmedUtf16Length:source.trim().length, resultUtf16Length:payload.text?.length, exactKeptSource:payload.text===source};\n}\n");
  await save('invocation-before.json',receipt);
  const shape=typeof tools.iot_thoughts_compact;
  await save('runtime-tool-shape.json',{type:shape,available:shape==='function',at:new Date().toISOString()});
  if(shape!=='function'){receipt.status='BLOCKED: production tool not available';}
  else {
    receipt.callCount=1;
    const raw=await tools.iot_thoughts_compact(request.params);
    // MUST durably persist every raw field BEFORE parsing or acceptance.
    await save('raw-tool-return.txt',typeof raw==='string'?raw:JSON.stringify(raw,null,2));
    receipt.rawDurable=true;receipt.status='raw saved';
    await save('raw-saved-receipt.json',receipt);
    const text=typeof raw==='string'?raw:JSON.stringify(raw);
    await save('raw-tool-return.json',{type:typeof raw,value:raw});
    let payload;
    const direct=(()=>{try{return JSON.parse(text);}catch{return null;}})();
    if(direct&&typeof direct==='object'&&'status' in direct&&'nodes' in direct)payload=direct;
    else {
      const candidates=[text];
      const visit=value=>{if(typeof value==='string')candidates.push(value);else if(Array.isArray(value))value.forEach(visit);else if(value&&typeof value==='object')Object.values(value).forEach(visit);};
      if(direct)visit(direct);else if(typeof raw==='object')visit(raw);
      for(const candidate of candidates){const match=/<iot_thoughts_result>\n([\s\S]*?)\n‹\/iot_thoughts_result>/.exec(candidate);if(match){payload=JSON.parse(match[1]);await save('raw-tool-text.txt',candidate);break;}}
    }
    if(!payload){receipt.status='FAIL: no parseable complete result';}
    else {
      await save('parsed.json',payload);
      const checks=diagnose(request.params.text,payload,expectedTags);
      const extra={oneEach8Tags:expectedTags.every(tag=>checks.actualCounts[tag]===1),allRangeBounds:checks.ranges.every(node=>node.integers&&node.inBounds)};
      await save('per-condition.json',{...checks,extra});
      receipt.acceptance=checks.combined&&extra.oneEach8Tags&&extra.allRangeBounds;
      receipt.status=receipt.acceptance?'PASS':'FAIL';
      await save('acceptance.exit',receipt.acceptance?'0\n':'1\n');
    }
  }
} catch(error){receipt.status='FAIL: execution or evidence persistence';receipt.errors.push({name:error?.name??'Error',message:String(error?.message??error),stack:error?.stack??null});try{await save('exception.json',receipt.errors);}catch(writeError){receipt.errors.push({writeFailure:String(writeError)});}}
receipt.finishedAt=new Date().toISOString();
try{await save('receipt.json',receipt);}catch(error){receipt.status='FAIL: final evidence write';receipt.errors.push({writeFailure:String(error)});}
text({status:receipt.status,callCount:receipt.callCount,rawDurable:receipt.rawDurable,acceptance:receipt.acceptance??false,errors:receipt.errors,rawPath:dir+'raw-tool-return.txt',checksPath:dir+'per-condition.json',receiptPath:dir+'receipt.json'});
return receipt;
