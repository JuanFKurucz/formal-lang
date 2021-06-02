// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const lexer = require("./lexer.js");

const FUNCTIONS = new Map([
    ['abs', Math.abs],
    ['acos', Math.acos],
    ['acosh', Math.acosh],
    ['asin', Math.asin],
    ['asinh', Math.asinh],
    ['atan', Math.atan],
    ['atanh', Math.atanh],
    ['atan2', Math.atan2],
    ['cbrt', Math.cbrt],
    ['ceil', Math.ceil],
    ['clz32', Math.clz32],
    ['cos', Math.cos],
    ['cosh', Math.cosh],
    ['exp', Math.exp],
    ['expm1', Math.expm1],
    ['floor', Math.floor],
    ['fround', Math.fround],
    ['hypot', Math.hypot],
    ['imul', Math.imul],
    ['log', Math.log],
    ['log1p', Math.log1p],
    ['log10', Math.log10],
    ['log2', Math.log2],
    ['pow', Math.pow],
    ['random', Math.random],
    ['round', Math.round],
    ['sign', Math.sign],
    ['sin', Math.sin],
    ['sinh', Math.sinh],
    ['sqrt', Math.sqrt],
    ['tan', Math.tan],
    ['tanh', Math.tanh],
    ['trunc', Math.trunc],
    ['max', Math.max],
    ['min', Math.min],
]);

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "E", "symbols": ["E", (lexer.has("opEq") ? {type: "opEq"} : opEq), "L"], "postprocess": ([num1, , num2]) => (num1 == num2)},
    {"name": "E", "symbols": ["E", (lexer.has("opNotEq") ? {type: "opNotEq"} : opNotEq), "L"], "postprocess": ([num1, , num2]) => (num1 != num2)},
    {"name": "E", "symbols": ["E", (lexer.has("opLtEq") ? {type: "opLtEq"} : opLtEq), "L"], "postprocess": ([num1, , num2]) => (num1 <= num2)},
    {"name": "E", "symbols": ["E", (lexer.has("opLt") ? {type: "opLt"} : opLt), "L"], "postprocess": ([num1, , num2]) => (num1 < num2)},
    {"name": "E", "symbols": ["E", (lexer.has("opGtEq") ? {type: "opGtEq"} : opGtEq), "L"], "postprocess": ([num1, , num2]) => (num1 >= num2)},
    {"name": "E", "symbols": ["E", (lexer.has("opGt") ? {type: "opGt"} : opGt), "L"], "postprocess": ([num1, , num2]) => (num1 > num2)},
    {"name": "L", "symbols": ["L", (lexer.has("opSum") ? {type: "opSum"} : opSum), "T"], "postprocess": ([num1, , num2]) => (num1 + num2)},
    {"name": "L", "symbols": ["L", (lexer.has("opSub") ? {type: "opSub"} : opSub), "T"], "postprocess": ([num1, , num2]) => (num1 - num2)},
    {"name": "E", "symbols": [(lexer.has("kwIf") ? {type: "kwIf"} : kwIf), "E", (lexer.has("kwThen") ? {type: "kwThen"} : kwThen), "E", (lexer.has("kwElse") ? {type: "kwElse"} : kwElse), "E"], "postprocess": ([, cond, , expr1, , expr2]) => (cond ? expr1 : expr2)},
    {"name": "L", "symbols": ["FN"], "postprocess": ([expr]) => expr},
    {"name": "T", "symbols": ["FN"], "postprocess": ([expr]) => expr},
    {"name": "FN$ebnf$1", "symbols": ["A"], "postprocess": id},
    {"name": "FN$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "FN", "symbols": ["FI", (lexer.has("lp") ? {type: "lp"} : lp), "FN$ebnf$1", (lexer.has("rp") ? {type: "rp"} : rp)], "postprocess": ([name, , args, ]) => (FUNCTIONS.get(name) || (function(){throw `Undefined function name: ${name}`}())).apply(null, args)},
    {"name": "A", "symbols": ["E"], "postprocess": ([expr]) => [expr]},
    {"name": "A", "symbols": ["A", (lexer.has("argSeparator") ? {type: "argSeparator"} : argSeparator), "E"], "postprocess": ([expr1, , expr2]) => { expr1.push(expr2); return expr1; }},
    {"name": "T", "symbols": ["T", (lexer.has("opMult") ? {type: "opMult"} : opMult), "F"], "postprocess": ([num1, , num2]) => (num1 * num2)},
    {"name": "T", "symbols": ["T", (lexer.has("opIntDiv") ? {type: "opIntDiv"} : opIntDiv), "F"], "postprocess": ([num1, , num2]) => (Math.floor(num1 / num2))},
    {"name": "T", "symbols": ["T", (lexer.has("opDiv") ? {type: "opDiv"} : opDiv), "F"], "postprocess": ([num1, , num2]) => (num1 / num2)},
    {"name": "T", "symbols": ["T", (lexer.has("opMod") ? {type: "opMod"} : opMod), "F"], "postprocess": ([num1, , num2]) => (num1 % num2)},
    {"name": "T", "symbols": ["T", (lexer.has("opOr") ? {type: "opOr"} : opOr), "F"], "postprocess": ([num1, , num2]) => (num1 || num2)},
    {"name": "T", "symbols": ["T", (lexer.has("opAnd") ? {type: "opAnd"} : opAnd), "F"], "postprocess": ([num1, , num2]) => (num1 && num2)},
    {"name": "T", "symbols": [(lexer.has("opNot") ? {type: "opNot"} : opNot), "F"], "postprocess": ([, num]) => (!(num))},
    {"name": "E", "symbols": ["L"], "postprocess": ([expr]) => expr},
    {"name": "L", "symbols": ["T"], "postprocess": ([expr]) => expr},
    {"name": "T", "symbols": ["F"], "postprocess": ([expr]) => expr},
    {"name": "T", "symbols": [(lexer.has("lp") ? {type: "lp"} : lp), "E", (lexer.has("rp") ? {type: "rp"} : rp)], "postprocess": ([, num, ]) => Number(num)},
    {"name": "F", "symbols": [(lexer.has("lp") ? {type: "lp"} : lp), "E", (lexer.has("rp") ? {type: "rp"} : rp)], "postprocess": ([, num, ]) => Number(num)},
    {"name": "L", "symbols": [(lexer.has("lp") ? {type: "lp"} : lp), "E", (lexer.has("rp") ? {type: "rp"} : rp)], "postprocess": ([, num, ]) => Number(num)},
    {"name": "F", "symbols": [(lexer.has("opSub") ? {type: "opSub"} : opSub), (lexer.has("lp") ? {type: "lp"} : lp), "E", (lexer.has("rp") ? {type: "rp"} : rp)], "postprocess": ([, , num, ]) => (Number(num) * -1)},
    {"name": "F", "symbols": [(lexer.has("opNot") ? {type: "opNot"} : opNot), (lexer.has("lp") ? {type: "lp"} : lp), "E", (lexer.has("rp") ? {type: "rp"} : rp)], "postprocess": ([, , num, ]) => (!(num))},
    {"name": "F", "symbols": [(lexer.has("opNot") ? {type: "opNot"} : opNot), "E"], "postprocess": ([, num]) => (!(num))},
    {"name": "F", "symbols": ["N"], "postprocess": ([num]) => Number(num)},
    {"name": "F", "symbols": [(lexer.has("opSub") ? {type: "opSub"} : opSub), "N"], "postprocess": ([, num]) => (Number(num) * -1)},
    {"name": "F", "symbols": ["FN"], "postprocess": ([expr]) => expr},
    {"name": "F", "symbols": [(lexer.has("opSub") ? {type: "opSub"} : opSub), "B"], "postprocess": ([, bool]) => (bool * -1)},
    {"name": "F", "symbols": ["B"], "postprocess": ([bool]) => (bool)},
    {"name": "N", "symbols": [(lexer.has("number") ? {type: "number"} : number)]},
    {"name": "B", "symbols": [(lexer.has("boolean") ? {type: "boolean"} : boolean)], "postprocess": ([bool]) => (bool == "true")},
    {"name": "FI", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": ([name]) => (name.value)}
]
  , ParserStart: "E"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
