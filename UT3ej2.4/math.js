// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const lexer = require("./lexer.js");

const FUNCTIONS = new Map([
  ['max', Math.max],
  ['min', Math.min],
]);

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "E", "symbols": ["E", (lexer.has("opSum") ? {type: "opSum"} : opSum), "T"], "postprocess": ([num1, , num2]) => (num1 + num2)},
    {"name": "E", "symbols": ["E", (lexer.has("opSub") ? {type: "opSub"} : opSub), "T"], "postprocess": ([num1, , num2]) => (num1 - num2)},
    {"name": "E", "symbols": ["E", (lexer.has("opEq") ? {type: "opEq"} : opEq), "T"], "postprocess": ([num1, , num2]) => (num1 == num2)},
    {"name": "E", "symbols": ["E", (lexer.has("opNotEq") ? {type: "opNotEq"} : opNotEq), "T"], "postprocess": ([num1, , num2]) => (num1 != num2)},
    {"name": "E", "symbols": ["E", (lexer.has("opLtEq") ? {type: "opLtEq"} : opLtEq), "T"], "postprocess": ([num1, , num2]) => (num1 <= num2)},
    {"name": "E", "symbols": ["E", (lexer.has("opLt") ? {type: "opLt"} : opLt), "T"], "postprocess": ([num1, , num2]) => (num1 < num2)},
    {"name": "E", "symbols": ["E", (lexer.has("opGtEq") ? {type: "opGtEq"} : opGtEq), "T"], "postprocess": ([num1, , num2]) => (num1 >= num2)},
    {"name": "E", "symbols": ["E", (lexer.has("opGt") ? {type: "opGt"} : opGt), "T"], "postprocess": ([num1, , num2]) => (num1 > num2)},
    {"name": "E", "symbols": [(lexer.has("kwIf") ? {type: "kwIf"} : kwIf), "E", (lexer.has("kwThen") ? {type: "kwThen"} : kwThen), "E", (lexer.has("kwElse") ? {type: "kwElse"} : kwElse), "E"], "postprocess": ([, cond, , expr1, , expr2]) => (cond ? expr1 : expr2)},
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
    {"name": "E", "symbols": ["T"], "postprocess": ([expr]) => expr},
    {"name": "T", "symbols": ["F"], "postprocess": ([expr]) => expr},
    {"name": "T", "symbols": [(lexer.has("lp") ? {type: "lp"} : lp), "E", (lexer.has("rp") ? {type: "rp"} : rp)], "postprocess": ([, num, ]) => Number(num)},
    {"name": "F", "symbols": [(lexer.has("lp") ? {type: "lp"} : lp), "E", (lexer.has("rp") ? {type: "rp"} : rp)], "postprocess": ([, num, ]) => Number(num)},
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
