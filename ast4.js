const parser = require("@babel/parser");
const traverse = require('@babel/traverse').default;
const generator = require("@babel/generator").default;
const fs1 = require("fs");
const t = require("@babel/types");
let  scriptID = ""
let jsFile = fs1.readFileSync("./raw.js","utf-8");
ast = parser.parse(jsFile);
let   decode_JS = generator(ast,{minified:true,jsescOption:{minified: true}}).code
ast = parser.parse(decode_JS);
window =globalThis;
let pool_name = []
let case_start = {
    "start_index":0,
    "func_name":'',
    "run_time":[],
    "case_select": ''
}
let self_main_func_name = ast.program.body[0].expression.callee.id.name
// 获取法身

// 获取start
let eval_init_scripts = ''
let count = 0
let dharmakaya  = ''
let Dharma_name = ''
let Dharma_case = {}
// 使用正则表达式匹配所有的数组和它们的.push调用
const regex = /\b(\w+)\.push\(/g;
let match;
const pushCounts = {};

// 统计每个数组的.push调用次数
while ((match = regex.exec(jsFile)) !== null) {
    const arrayName = match[1];
    if (!pushCounts[arrayName]) {
        pushCounts[arrayName] = 0;
    }
    pushCounts[arrayName]++;
}
let maxPushes = 0;
let mostFrequentArray = null;
for (const [array, count] of Object.entries(pushCounts)) {
    if (count > maxPushes) {
        maxPushes = count;
        mostFrequentArray = array;
    }
}
Dharma_name = mostFrequentArray;

ast.program.body[0].expression.callee.body.body.forEach(
    (_node)=>{
        if(count == 0){
            dharmakaya = _node.expression.callee.name;
        }
        if(_node.type === "ReturnStatement"){
            case_start['start_index'] = _node.argument.arguments[1].name;
            case_start['func_name'] =  _node.argument.callee.object.name;
            return
        }
        if(_node.type === "FunctionDeclaration"){
            try{
                if(generator(_node.body.body[0]).code.includes(self_main_func_name)){
                    // 替换掉脚本hash_id检测
                    let script_str = jsFile.substr(1,jsFile.length-5);
                    let script_self_func_name = _node.body.body[0].expression.right.arguments[1].value;
                    let scripts_validate = _node.body.body[0].expression.right.arguments[2].value;
                    let CurrentScriptVaildateNumber =  getCurrentScriptVaildateNumber(script_str, script_self_func_name, scripts_validate)
                    let new_node = t.assignmentExpression(
                        '=',
                        t.identifier(_node.body.body[0].expression.left.name), // 赋值的目标，变量名 'w4'
                        t.numericLiteral(CurrentScriptVaildateNumber)// 赋值的值，数字 480
                    );

                    _node.body.body[0].expression = new_node
                    eval_init_scripts += generator(_node).code + '\n'
                    return
                };
                if(_node.id.name === dharmakaya){
                    _node.body.body.forEach(
                        (_node1)=>{
                            if(_node1.type === "ExpressionStatement"){
                                if(_node1.expression.type==="AssignmentExpression"){
                                    if(_node1.expression.operator === '='){
                                        dharmakaya = _node1.expression.left.name;
                                    }
                                }
                            }
                        }
                    )
                }
            }catch{

            }
        }
        count += 1
        eval_init_scripts += generator(_node).code + '\n'
    }
)
// 初始化第一部分和第二部分的常量池
eval(eval_init_scripts)

console.log(case_start)
// 获取所有待赋值属性case
traverse(
    ast,{
        SwitchCase(path){
            try{
                let case_select = path.parent.discriminant.name;
                if(path.node.consequent[0].body.slice(-1)[0].type === 'ReturnStatement'){
                    if(path.node.consequent[0].body.slice(-1)[0].argument.type === 'ArrayExpression'){
                        pool_name.push(path.node.test.name)
                    }
                }

            }catch{

            }
    }
    }
)
function jBc(a, b, c) {
    return a.indexOf(b, c);
}
function hBc(a, b, c) {
    return a.substr(b, c);
}
function MBc(a, b) {
    return a.charCodeAt(b);
}
function wBc(gBc, kBc) {
    var IBc = kBc;
    var DBc = 0xcc9e2d51;
    var qBc = 0x1b873593;
    var nBc = 0;
    for (var BBc = 0; BBc <gBc.length; ++BBc) {
        var ZBc = MBc(gBc, BBc);
        if (ZBc === 10 || ZBc === 13 || ZBc === 32)
            continue;
        ZBc = (ZBc & 0xffff) * DBc + (((ZBc >>> 16) * DBc & 0xffff) << 16) & 0xffffffff;
        ZBc = ZBc << 15 | ZBc >>> 17;
        ZBc = (ZBc & 0xffff) * qBc + (((ZBc >>> 16) * qBc & 0xffff) << 16) & 0xffffffff;
        IBc ^= ZBc;
        IBc = IBc << 13 | IBc >>> 19;
        var zBc = (IBc & 0xffff) * 5 + (((IBc >>> 16) * 5 & 0xffff) << 16) & 0xffffffff;
        IBc = (zBc & 0xffff) + 0x6b64 + (((zBc >>> 16) + 0xe654 & 0xffff) << 16);
        ++nBc;
    }
    IBc ^= nBc;
    IBc ^= IBc >>> 16;
    IBc = (IBc & 0xffff) * 0x85ebca6b + (((IBc >>> 16) * 0x85ebca6b & 0xffff) << 16) & 0xffffffff;
    IBc ^= IBc >>> 13;
    IBc = (IBc & 0xffff) * 0xc2b2ae35 + (((IBc >>> 16) * 0xc2b2ae35 & 0xffff) << 16) & 0xffffffff;
    IBc ^= IBc >>> 16;
    return IBc >>> 0;
}
function getCurrentScriptVaildateNumber(script_str, script_self_func_name, scripts_validate){
    var xBc = jBc(script_str, "0x" + scripts_validate);
    var OBc = jBc(script_str, ';', xBc);
    var PBc = xBc + scripts_validate.length + 3;
    var NBc = script_str.substr(PBc, OBc - PBc)
    var TBc = script_str.substr(0, xBc);
    var QBc = script_str.substr(OBc + 1)
    var WBc = TBc + QBc + undefined;
    var EBc = wBc(WBc, 42432);
    return NBc - EBc;
}

let switch_run_index1 = {}
function check_case (_code) {
    for(let i=0; i<pool_name.length;i++){
        if(_code.includes(pool_name[i])){
            return true
        }
    }
    return false
}

let switch_run_index = {}
function switch_runtime_sort(index){
    let next =  eval(switch_run_index[index]["next_eval_str"])
    switch_run_index[index]["next"] = next
    case_start['run_time'].push(switch_run_index[index]["head_str"])
    if(switch_run_index[next]){
        switch_runtime_sort(next)
    }

}
// 获取所有待赋值case
let case_map  = {}
traverse(
    ast,{
        SwitchCase(path){
            try{
                let main_func_name = path.parentPath.parentPath.parentPath.parentPath.parentPath.parent.id.name
                let _case_name = path.node.test.name;
                let case_str = ''
                let isCheck = false
                let case_select = path.parent.discriminant.name;
                path.node.consequent[0].body.forEach((_path)=>{
                    let _path_code = generator(_path).code;
                    if(_path_code.includes(case_select)){
                        if(main_func_name === case_start.func_name){
                            switch_run_index["case_select"] = case_select
                            switch_run_index[eval(_case_name)]=
                                {
                                    "head_str":  _case_name,
                                    "next_eval_str": _path_code,
                                    // "head": eval(_case_name)
                                    "next": eval(`${case_select}=${_case_name};${_path_code}`)
                                }

                        }
                        if(switch_run_index1[main_func_name] === undefined){
                            switch_run_index1[main_func_name] ={}
                        }
                        switch_run_index1[main_func_name]["case_select"] = case_select
                        switch_run_index1[main_func_name][eval(_case_name)]=
                            {
                                "head_str":  _case_name,
                                "next_eval_str": _path_code,
                                // "head": eval(_case_name)
                                "next": eval(`${case_select}=${_case_name};${_path_code}`),
                                "node": path.node
                            }



                    }else{
                        case_str += `${_path_code}\n`
                        if(_path.type==="ExpressionStatement"){
                            if(_path.expression.type==="CallExpression"){
                                if(check_case(_path_code)){
                                    isCheck = true
                                }
                            }
                        }

                    }



                });
                if(isCheck){
                    // 收集赋值case_match
                    case_map[_case_name] = case_str

                }
                if(_case_name===case_start.start_index && main_func_name === case_start.func_name){
                    // 收集平坦流的启动的case_match
                    case_map[_case_name] = case_str
                    // 获取达摩-法号

                }


            }catch (e){
                // console.log(e)
            }
        }
    }
)




eval(`${switch_run_index.case_select} = ${case_start.start_index}`)
case_start.start_index = eval(case_start.start_index)
switch_runtime_sort(case_start.start_index)
// console.log(pool_name);
// console.log(Object.values(case_map)o.join('\n\n'))
let Exodia = ''
// 按runtime 顺序组装平坦流的执行语句， 召唤エクゾディア（艾克佐迪亚）
// parser.parse(case_map[case_start.run_time[1]]).program.body.forEach(
//     (_node2)=>{
//         ;
//         if(_node2.expression.type === "AssignmentExpression"){
//             if(_node2.expression.right.type === "CallExpression"){
//                 if(Dharma_name===''){
//                     Dharma_name = _node2.expression.left.name;
//                 }
//
//             }
//         }
//     }
// )
let DecoderCaseRunTime = case_start.run_time.join(' => ')
console.log(`[DecoderCaseRunTime]: <${DecoderCaseRunTime}>`)
for(let i=0; i < Object.keys(case_map).length; i++){
    let organ = case_map[case_start.run_time[i]];
    Exodia += organ
}

console.log('さあ! エクゾディア!!!!')
console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%%%%%#####******++++++++++++++\n' +
    '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%*++=---=+#%@@@@@@@@@@@@@@@@@@@@%*+====+*#%%@@@@@@@@@%%%%%%%####******+++++++++++++++\n' +
    '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#+===-.....:-=*@@@@@@@@@@@@@@@@%+-.....:-=++#%@@@@@@@%%%%%%%####*******+++++++++++++++\n' +
    '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#*++=-......:-+%@@%#*++*#%@@#=:....:-=++#@@@@@@@@@@@@@@@@%##*******+++++++++++++++++\n' +
    '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%%%@@@@@@@@@@%#+=-......:+#@@*+==+#@@#=....:-=+#@@@@@@@@@@%%%@@@@@@%%@@@%#*+++++++++++++++++++\n' +
    '#%@@@@@@@@@@@@@@@@@@@@@@%%#**++++++++++*##%%%@@@%#+=-:....-+%@%+==*@@#=...:-=+%@@@@@@%%#*****+++++=++**##%%%@@%*+=====+++*#%@@@\n' +
    '+**###%%@@@@@@@@@@@%##*+++====------::....:-=++#%@@#+==-:.:-*@@#++%@%+::-=+#%@@@@%#*+=====------------===++***##%%#*==*%@@@%%%#\n' +
    '+++++*##%%%@@@@@%***++++++++===------::........:-=*%@%+=-:.:-#@%**@@*--=+*%@@@%*++====+===--===-----.:----::----=+**%@@@%%%%%%%\n' +
    '==++++#%%%@@@%%######%%@@@@@@@@@@@@@@%%%%#+=-:....:=+#%#+=:.:+%@#%@%+=+*%@@%#++=+++***#@@@@@@@@@@@@@@@@@@@@#*+*=+--=++#%%%%####\n' +
    '==+++*%%@@@@@@@@@@@@@@@@@##%%@%#+-=*%%%#*%@@@@%#*=-:-==#%+-::-#@#%%*+*%@@%*+*##@@@@%%@@%*-:-+####+:-+##%%*==*%%%%@@@@%%%%%%%#**\n' +
    '--==+%@@@@@@@@@@@%%*=--+##*-..=##%+=+%@@@+=+%@@@@@@@%+=--**:::*%*#++#@@%%%@@@@@@@%#@@@@+==%@%%*..=#**=...-+**+-:-+#%%%%%@@@%@@*\n' +
    '::::=@@@@@@%%%*:..-**+-..-#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#++*::-=--=+%%@@@@@@@@@@@@%@@@@*+*@@@@%%@@@@=+#%#+-..-+**+==--*%%@@%#+=\n' +
    '....::=+**-..-*#*-..-%@@@@@@@@@@@@@@%%@%%@%%%@@@@@@@@@@@@@@#@+:..:+@@@@@@@@@@@@@@@#*@%#*..+##+..%#%#+@%@%+#%%#=-=#@@@@%#*+==-::\n' +
    '......:--==+=:..+%@@@@@@@@%#@%%+*%#%#*#%%@%%%@@@@@@@@@@@@@@@@@@##@@@@@@@@@@@@@@@@@@@@%%@==#*#-..#**--%##-+%@@@@@@@%#*++==--::..\n' +
    '......:::--=+**%@@@@@@%%#%:.#*#+=%@@@%@@%*+=--==+**+=+++#@###@%+-%@@@@@@@@%%%%%**+++*#%@@@@%@*:-#*#.-***.-%%%@@@@%*+++==--::...\n' +
    '......:---=++#%@@@@@@#=+**=.:%%@%%@@@@@#+==+++**%@@#=*@@%=+*%**=.*#*##+#@@++#%@%*+*+*++#%@%@@%#@%#%.#**=.-%%#@@@@%#*++==---::..\n' +
    '....:---==+#%@@@@@@%%#=:##%*+#@@@@@*===+**=-::--*@%%+:::#%%@@@**=#%@@%#%=::=##%#+++==+*#***#%%@@%%#-%##::*%%#@@@@@%#**+==---:::\n' +
    ':----==+*%@@@@@@@@@#%%%==@%@%%@@@@##+----=*##*+=*#=+@%@@@@@#%@@%+@@@@@@@@@=*=-++=++*##*+====+#@%%@#@%%#-+@@%#@@@@@@%%*+++==----\n' +
    '===++*#%@@@@@@@@@@@@#@@%+*@%@@@@+==+##*#%@%%@@@@@@@@@@@@@@@*#+#*%##+%+@@%%@@@@@#+****+***+*%#+=+@%@@%@##@@@@@@@@@@@@@@%#*++===-\n' +
    '++**%%@@@@@@@@@@@@@@@#%@@@@@@@*+#%*%@@@@@@@@@@@@@%%%%@@@@%@@@#%##%###@@#@@@#*++#%#**%@@@@@@@@@#%%@@%@@%@@@@@@@@@#**%@@@@@@%#++=\n' +
    '+*%%@@@@@@@%%%%%@@@@@@%@@@@@@%%*%@@@@@@@@@@@@%#%%%%@@%#++#+@@@@*=*@@@##*--====-=+=+*%@@@@@@@@@@@@#@@@@@@@@@@@@@@%+=--==*%%@%%%#\n' +
    '*##%#*+===++*#%@@@@@@@@@@@@@#+%@@@@@@@@@@@@@@@@%*+====+**%%*=:-%@@+::*=:......-+#%@@@@@%%%#%@@@@@@@#@@%@@@@@@@@@@@@*=-::::----=\n' +
    '........-=*#%@@@@@@@@@@@@@@%@@@@@@%%%%###%%%%%@@@@%#++=----=*%@@%%@@@=...:-*%@@@@@%*+======++#%@@@@@#@@@@%%##%%@@@@@@%#+-:.....\n' +
    '....:-=+#%@@@@@@@@@@@@%%@@@@@%@%+++===========+******###%#**#%@%*#%@%==+*#***++----=----------==*@@@+%%*+++++++*%%@@@@@@@#+-:..\n' +
    '-==+*%@@@@@@@@@@@@@@@#+==-:::-=+**#*=------====------===+=+-=%#...=%%#--=:-:..:::::::::::----===--====-====+*+===++*%%@@@@@@%#+\n' +
    '@@@@@@@@@@@@@@@%@@#:..=#@@@%%##*+-:-+##=--=====------...-+#.-+......%@::@+-:::--::::::::::-==::=#@@%%%%%%%%%*=+*+=--=++#%@@@@@@\n' +
    '@@@@#%@@@@@@%%%%@-..*@@#*+==----=+#*-:=%%===---:::+=..%@@@@#.........=+*@%@@*..=-:::::::::-..+@@#++++=======#%-.=%+===+%@@@@%*#\n' +
    '@@@@#*%@@@@@%%##@=.:%@**++=*-::--:-#%-:*@#--:::-:::=#**#@@=....=@#:...:#@@@*::==-::::::::-..+@@*++=:..:=+===-#*..+#==+%@@@@+=#@\n' +
    '@@@@@+=%@@@@%%##@@*::+###*+#:..=#+=**:.+@#*++++++++=+#@@*====+%@@@@*++==+#*#*+--===++*####:.=@@*+*...%%==++==+:.=@#+*%@@@+:-%@%\n' +
    '@@@@@@+-*@@@%%#**#@@@#+=--:-=*%#**#+::+#@@############@*****#@@@@@@@@#****%@%%%%%%%%%%%%%@@%*+*%*##-..:::::::-+%@#*#@@@@=:=@@@%\n' +
    '@%%%@@@*-+@@@%#******#%%%@@%%#++*+:.-*@#+-::.:--==+++*###%%@@@@@@@@@@@@#%%#*******+==-:::-+%%+-=*###%%%%%%%%%%#++#%@@@*-=#@@@#+\n' +
    '@@@##%@@#-:*@@@%%##****+++*****#%%*-:-*@%#**####**###%%%%@@@@@@@@@@@@@@@%%%%%##***########@@*-=*@@@%+++++++++++%%@@@#==#@@@%*+=\n' +
    '@@@@%#%@@@#-:*@@@@%%%%%%%%%%%##%#%@@#=::+%@%#****##%@@@@@@@@@@@@@@@@@@@@@@@@@%#%######%@@@=.:*@@@@%**##**+***#%@@@%+=#@@@%*++##\n' +
    '%@@@@@@@@@@@#-:=@@@@@@@@@@%*+#@@@@@@@@@#-:-#@%%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#=:.=%@@@@%%@@%+=+*#%%@@@%*==%@@@@%%%@@@@\n' +
    '@@@@@@@@@@@@@@%+:-+*##*++#@@@#**#%@@@@@@@%+---+#%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%=:-=+#@@@@%%@@@#+#@@@@#+-=--=*@@@@@@@@@@@@@@')
eval(Exodia)
console.log(`[${dharmakaya}_Length]: ${Object.keys(eval(dharmakaya)).length}`)
traverse(
    ast,{
        SwitchCase(path){
            try{
                let main_func_name = path.parentPath.parentPath.parentPath.parentPath.parentPath.parent.id.name
                let _case_name = path.node.test.name;
                let case_str = ''
                let isCheck = false
                let case_select = path.parent.discriminant.name;
                path.node.consequent[0].body.forEach((_path)=>{
                    if(_path.type==="ExpressionStatement"){
                        if(_path.expression.type === "CallExpression"){
                            if(_path.expression.callee.object.name === Dharma_name){
                                if(_path.expression.callee.property.name==='push'){
                                    if(Dharma_case[main_func_name] === undefined){
                                        Dharma_case[main_func_name] ={}
                                    }
                                    Dharma_case[main_func_name][eval(_case_name)] = {
                                        "node_str":generator(_path).code,
                                        "Dharma_nums": eval(_path.expression.arguments[0].name)
                                    }
                                }

                            }
                        }
                    }
                })}catch (e) {

            }
        }
    })



// sF = [750, 783, 923, 634, 747, 771, 519, 460]

function gen_new_node(_res){
    let _node = undefined;
    if(_res===undefined){
        return _node
    }
    if(typeof _res === "number"){
        _node = t.NumericLiteral(_res)
    }else if(typeof _res === "boolean"){
        _node = t.BooleanLiteral(_res)
    }else if(typeof _res==="string"){
        _node = t.StringLiteral(_res)
        // console.log(_res)
    }
    else{
        console.log(`${typeof _code} Unknown Type！` )
    }
    return _node
}
Object.keys(switch_run_index1).forEach(
    (_key)=>{
        if(Object.keys(switch_run_index1[_key]).length > 1){
            Object.keys(switch_run_index1[_key]).forEach(
                (_key1)=> {
                    if(_key1 === "case_select"){
                        return
                    }
                    let next_key = switch_run_index1[_key][_key1]["next"]
                    try{
                        switch_run_index1[_key][_key1]["Dharma_nums"] = Dharma_case[_key][_key1]['Dharma_nums']
                    }catch{

                    }
                    if(switch_run_index1[_key][eval(next_key)]!== undefined){
                        switch_run_index1[_key][_key1]["next"] = switch_run_index1[_key][eval(next_key)]
                        switch_run_index1[_key][eval(next_key)]['head'] = switch_run_index1[_key][_key1]
                    }else{
                        // switch_run_index1[_key][eval(next_key)]['head'] = switch_run_index1[_key][_key1]
                        switch_run_index1[_key][_key1]["next"] = 'end'
                    }
                }
            )
        }

    }
)

// function sacrificial_ceremony(case_start){
//     let altar = []
//     let current_node = switch_run_index1[case_start["func_name"]][case_start["start_index"]]
//     while (current_node) {
//         if (current_node.node !== 'end') {
//             let _zz = ''
//             if(current_node.node != undefined){
//                 current_node.node.consequent[0].body.forEach((__node)=>{
//                     _zz += generator(__node).code+'\n';
//
//                 })
//                 altar.push(_zz)
//             }else{
//                 _zz += '\n'
//                 altar.push(_zz)
//             }
//
//
//         }
//         current_node = current_node.next;
//     }
//     let final_rite = altar.slice(2,-2)
//     return final_rite.join(`//------- next_step ------\n`)
//
// }
// final_rite  = sacrificial_ceremony(case_start)

function findClosestSwitchCase(node) {
    let current = node;
    while (current) {
        if (current.type === 'SwitchCase') {
            return current;
        }
        current = current.parentPath;
    }
    return null; // 如果没有找到，返回null
}
function findCaseRunTimeDharma(_node){
    let current = _node;
    while (current) {
        if (current.Dharma_nums !== undefined) {
            return current.Dharma_nums
        }
        current = current.head;
    }
    return null
}

traverse(
    ast,{
        CallExpression(path){
            try {
                if(path.node.callee.object.name === dharmakaya || path.node.callee.object.object.name===dharmakaya){
                    let __str = generator(path.node).code;
                    // if(__str==='dc.ff(Z8, z8)'){
                    //     // H4.xM(Vf(Vf(Jx)), AK, Cq, Vs)
                    //     debugger
                    // }

                    try{

                        let isNoDharma = true
                        let Dharma_list =  path.scope.getFunctionParent().path.node.body.body
                        for(let __i = 0; __i < Dharma_list.length; __i++){
                            let Dharma =  Dharma_list[__i];
                            try{
                                if(Dharma.expression.callee.object.name === Dharma_name){
                                    eval(generator(Dharma).code)
                                    isNoDharma =false
                                    break
                                }
                            }catch{

                            }
                        }
                        if(isNoDharma){
                            Dharma_list =  path.scope.block.body
                            for(let __i = 0; __i < Dharma_list.length; __i++){
                                let Dharma =  Dharma_list[__i];
                                try{
                                    if(Dharma.expression.callee.object.name === Dharma_name){
                                        if(Dharma.expression.callee.property.name==='push'){
                                            eval(generator(Dharma).code)
                                            isNoDharma =false
                                            break
                                        }

                                    }
                                }catch{

                                }
                            }
                        }
                        if(isNoDharma){
                            let parent_switch_case = findClosestSwitchCase(path);
                            let case_main_func = parent_switch_case.scope.getFunctionParent().path.parentPath.node.id.name;
                            let _case_name = parent_switch_case.node.test.name;
                            let Dharma = findCaseRunTimeDharma(switch_run_index1[case_main_func][eval(_case_name)])
                            if(Dharma === null){
                                eval(`${Dharma_name}.push(${Dharma_name}[0])`);
                            }else{
                                eval(`${Dharma_name}.push(${Dharma})`);
                            }

                        }
                    }catch (e){

                    }

                    // if(__str === 'H4.O5.call(null, cL, Mg, Tv, v8)'){

                    let decode_str = eval(__str);
                    if(decode_str === "index"){
                        // 抹除格式化检测
                        if(path.parentPath.parentPath.parentPath.parentPath.parentPath.type === "IfStatement"){
                            path.parentPath.parentPath.parentPath.parentPath.parentPath.node.test = gen_new_node(false)
                        }
                    }

                    console.log(`${__str} ==> ${decode_str}`)
                    let new_node = gen_new_node(decode_str)
                    path.replaceInline(new_node)
                    // sF = [750]
                }
            }catch (e){

            }
        }
    }
)
// 抹除格式化检测
let decode = generator(ast).code
// scriptID =
const scriptID_regex = '""\\["concat"]\\("(.*?)"\\);'

// 使用正则表达式进行匹配
const matches = decode.match(scriptID_regex);

// 输出匹配结果
scriptID = matches.slice(-1)[0]
console.log(`[scriptID]: ${scriptID}`);
fs1.writeFile("./deob.js",decode,function (){})

// console.log(sF)