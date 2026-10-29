# IoT configuration UI 0.2.0: DEPLOYED AND ENABLED — acceptance PASS

The graphical configuration workflow is deployed and passes acceptance.
IoT remains installed and enabled. Original effective settings are restored.
This feature is configuration UI, not a graph visualization.

**Preservation warning:** the global configuration file hash changed during concurrent work. Its cause is not established.
The task did not write, parse, or restore that file. Full unrelated-global-settings byte preservation is INCOMPLETE.
Do not infer a provider/model/credential change or claim those contents were audited. No blind restore occurred.

## Version, package, and tested runtime

- Pocket0.20.0@d1b97e1d995742dae90b20bcd1ce9545fdfc58c5,SDK1.3.0,extensionAPI2.
- IoT0.2.0 final package:dist/config-ui-0.2.0-final/pi-pocket-iot-thoughts-0.2.0.tgz.
- Package SHA:a4b1fe83dc95e6572b8aa40e94f8dc7cea4c96ced5dec66f4f60435862accfb3.
- Server SHA:14cdef54b0f0584199e0005a4dceb48af9b727eb7077ec56f71ea19a6f996287.
- JS SHA:4770e0dc86635ff9b31dbef796a1648f5acf5e33da9aac1873ecf6e754f66bf7.
- CSS SHA:0094a93f2beda4f95e4510791a4677183333b432881faecbee1510ddd045f7ff.
- Manifest SHA:0dd61705153f232d5e8f8e89643f5018e9413007f6b028872a9e10f08d985e13.
- Final archive:35620bytes,11regular files,all10manifest payload digests verified.

The final install tar is byte-identical to this exact final package.
The final docs-only package changes only docs/install.md and its manifest digest from the fully tested fixed-runtime package.
Server,JS,CSS,and all other runtime bytes are identical to the independent full UI/runtime verification.
The plugin working tree remains uncommitted. The old base commit does not identify the current deployed source.

## Independent isolated gates

All99tests pass:original56 plus43configuration/package cases. No skip or deletion occurs.
Type-check runs alone at45s and exits0. Fullsuite180s,lint45s,and format45s exit0.
Final-package integration120s,packaging45s,and exact-package audit45s exit0.
All3narrow authorized observation corrections preserve explicit409/408/500,exact prior bytes,and live-capability readback.
Actual PhaseA cross-version singlewinner409,getterzeroexecution,and visible desktop/mobile rendering regressions remain tested.

Independent isolated coverage includes owner-only auth/routes/client,no-write invalid requests,persistence,atomic/lock safety,foreign-lock preservation,cancellation,0700/0600,GET/next-tool refresh,envprecedence and merged bounds,reset under env,and real native-faux tool turns.
Normal-home visible entry clicks at1280x800 and390x844 verify the actual settings workflow without private page activation or stubs.
The exact684UTF-16 default extraction request passes twice with identical raw output and the original7conditions.
All old failed logs,diagnoses,packages,working changes,and2original.tmpfiles remain preserved.

See ../final/REPORT.md,../phase-b-observation/REPORT.md,and the retained ../phase-b/ui/ evidence.
The independent isolated test verdict and live planner browser receipts are separate evidence classes.

## Live navigation and controls — planner attribution

All production browser/API/config/service/inventory observations in planner-ui-and-state.json and preservation.json are supplied by the main planner.
This tester does not use its separate browser for production and does not claim independent live UI observation.

Actual navigation tested:

- Desktop1280x800:normal HOME -> visible sidebar IoT配置/IoTsettings entry.
- Mobile390x844:normal HOME -> visible IoT配置/IoTsettings entry.
- Menu -> App and launcher entries are registered additional paths; normal home entry is the path actually tested live.
- Page/client widths match1280/1280 and390/390; no horizontal page overflow.

All7exact setting keys render:enabled,profile,minChars,maxInputChars,maxNodes,maxOutputChars,timeoutMs.
They are1algorithmSwitch,1compact/balanced/fullselector,and5integer inputs.
The algorithm switch is distinct from Pocket's Menu -> Extensions module switch.
Settings precedence is DEFAULTS < SAVED < EXPLICIT ENV KEYS. Production env overrides remain{}.
Saving hot-applies to the next tool call without a Pocket restart.

Planner live workflow:

1. Official module reload200 at2026-10-23T14:29:52.874Z. Fresh originalGET200 at14:29:52.882Z records missing own config/no auto-seed and default stored/effective settings.
2. Desktop actual Switchfalse andSave shows Saved and applied/algorithmoff. OwnGET confirmsfalse.
3. Actual browser page refresh then normal entry preservesfalse. No server restart occurs.
4. Invalid maxNodes99 plusSave shows bilingual1..16integer error. Separate ownerPOST returns400invalid-settings; stored/effective/revision/filehash remain unchanged.
5. Reset opens explicit Confirm/Cancel. Actual Cancel closes it without writing and retainsfalse.
6. Mobile normal entry renders all7fields. Actual Switchtrue,compactselector,maxNodes3,andSave stores/effects compact3 with visible success.
7. Mobile page refresh plus normal entry preservescompact3.
8. Mobile Reset then explicit Confirm restores the original stored/effective defaults with visible Saved defaults restored.
9. OwnGET at2026-10-23T14:49:30.176Z records original defaults,env{},moduleLoaded/algorithmEnabled/hotApplytrue.
10. Final official module reload200 at2026-10-23T14:52:00.916Z proves persistence without a Pocket restart.

Live envlocked controls are not injected because production env is empty.
Envlocks,precedence,reset-underenv,unauthorizedroles,and concurrency attacks are verified in independent isolation only.
No live screenshots filesystem paths are invented. Normal browser clicks and snapshots are the provided live UI proof.

## Independent actual production tool phases

Exactly3phase-authorized actual production tool calls occur. Each has complete request and raw output saved before parsing/checking.
No extra fixture retry,paid model probe,local factory substitute,or settings mutation occurs in this tester session.

### Disabled phase — PASS

Directory:disabled/.
The exact saved684-unit request/profilefull produces kept/disabled,0nodes,verifiedfalse,and unchanged complete source text.
Input/output are684UTF-16units. Returned-text UTF-8SHA equals requestSHA:
eaaf9735e58cd8c007f42da892b2ba391795e1b752def522d5fb8d68695b6c2e.
RawSHA:de01d78b7254020888c7d73bda5ca29c0149c75d4b6ae19568e869150c683483;2425bytes.
No8node requirement is incorrectly applied while the algorithm is disabled.

### Stored compact phase — PASS

Directory:compact/.
The harmless isolated-UI fixture is reused with input>=400 and<=3critical candidates.
The request omits profile,so storedcompact is actually proven.
Result is compacted/profilecompact with3nodes,all exact source slices,integer/in-bounds UTF-16ranges,verifiedfalse,and strictly shorter text.
RawSHA:c6c09ecbedefa689bc1b8dfb99d30cdee8bf019056941d8f8e7450ce2d8877ff;988bytes.
The exact8category fixture is not substituted into the3node critical budget.

### Restored original defaults — PASS

Directory:restored/.
The unchanged684-unit request/profilefull passes every original condition:

| Original condition | Result |
| --- | --- |
| status compacted | true |
| exactly8nodes | true |
| all8expectedtags | true |
| allsource slices grounded | true |
| emojinode | true |
| verifiedfalse | true |
| strictlyshorter | true |

Each category occurs once; all ranges are integer and in bounds.
Output233UTF-16units,below trimmed source683.

| Tag | Start | End | Grounded | Emoji |
| --- | ---: | ---: | --- | --- |
| support |3|23|yes|yes|
| oppose |28|45|yes|no|
| tradeoff |50|68|yes|no|
| open |73|90|yes|no|
| plan |95|112|yes|no|
| decision |117|133|yes|no|
| risk |138|155|yes|no|
| neutral |160|176|yes|no|

RawSHA:e8592a9a8c028d413fb21c22528dddcd4a120090e2cce47ed11fb3ba2b7df3b2;2296bytes.
It matches the independent isolated exact outputs byte-for-byte.

Each phase contains request.json,raw-tool-return.txt,raw-tool-return.json,raw-tool-text.txt,parsed.json,per-condition.json,hashes.json,receipt.json,and acceptance.exit0.
The restored phase also preserves the original predicate helper and expectedtags.

## Final settings and enabled state

Original stored/effective values are restored exactly:

{enabled:true,profile:full,minChars:400,maxInputChars:24000,maxNodes:8,maxOutputChars:8000,timeoutMs:1000}.

Revision4698def6de5c6b3d51db2e8044d5ae531e7df2ea99d4703b117de261123005d3 equals the original.
Environment overrides remain{}. Algorithm,hotApply,and moduleLoaded aretrue.
The private persistence file now remains as expected new capability:dir0700,file0600,onlyconfig.json,no lock/temp.
The own config was initially absent. Effective settings are restored; physical absence is NOT restored and is not required.

Planner corrected finalGET2026-10-23T14:53:30.018Z confirms Owner,HTTP200,Pocket0.20,30modules27enabled0errors,and all recorded enabled states matching baseline,includingGuardfalse.
IoT,LayerFS,and dictionary remain enabled.
LatestGET2026-10-23T14:54:55.091Z confirms config/list200,same defaults/revision,IoTtrue,30/27/0,Guardfalse,visiblefull/maxNodes8,and empty console.
IoT registers read-onlyiot_thoughts_compact,3owner-only routes,and owner-only client.
No moduleoff,uninstall,or cleanup occurs afterPASS.

## Preservation and observation limit

Backup retained:/home/xianbei233/Work/private-iot-config-ui-20261023-222820,mode0700,globalreference0600,oldserver and previousclient/ownconfigabsence,inventory,and rollbackplan.
The tester does not read global configuration contents or credentials.

Planner final read-only inventory verifies all118other extension entries identical:otherExtensionDifferences[].
DictionarySHA15a0ceb363d92c7d0fc2b75c89a13f88e101285aa417db85039857aeda8e965e;locale1475strings/295templates unchanged.
LayerFSSHA c40cf6996b10dada4d8b9b48b4c829f185cbbb1e73656ca90b02e9a13f1b542f,PID4071753active,and enabled unchanged.
Production HEAD remains clean atd1b97e1d995742dae90b20bcd1ce9545fdfc58c5.
Final server/client/CSS/package/manifest hashes remain those listed above.

Global configuration referenceSHA:
88ea0b0d5d3a2ffaad265fe28dbaa92a4e1d9bba4a385e6f9c3241c1061334de.
Final globalSHA:
bb2779236cb9f1ecdf5ef62f92ebb27f677edf644cd00a3700dd9f1c5df4e146.
They DIFFER. Cause is not established. The task did not write,parse,or restore the global file.
The safe public API proves recorded module enabled states andGuardfalse match baseline.
It does not prove unrelated global settings/model/credential contents or whole-file byte preservation.
This is a documented incomplete preservation observation,not an inferred product failure or rollback trigger.
No blind restore occurs.

A planner compound final script initially throws because it comparesGuardagainst a windowbaseline cleared by real page refresh.
That baseline is absent. The comparison is invalid,not a product failure.
The later recorded-baseline safeAPI comparison confirmsGuardfalse unchanged.
This diagnostic is retained in planner-ui-and-state.json; it does not erase the earlier script failure or require another tool call.

## Role, limits, and freeze

Requested tester:hww/gpt-6.1-sol/high. Actual runtime metadata:not obtained. No model change/fallback.
Per-role generation,input,cacheRead,cacheWrite,outputIncludingReasoning,totalInput,average/maxcontext,and toolreturnbytes:not obtained.
No usage probe. Faux/tool counts are not usage.
No paid provider probe,hardware/MCP,production browser use by tester,auth/sessionDB recovery,core/dictionary/otherplugin/Guard/model change,restart,push,merge,or commit occurs.

Final verdict:configuration workflow and actual tool acceptance PASS; IoT0.2.0DEPLOYEDENABLED with original effective settings restored.
Warning:unattributed global configuration hash drift; unrelated whole-file byte preservation remains incomplete.
All work stops. Do not call,retune,disable,uninstall,retest,edit business files,or operate services after this report.
