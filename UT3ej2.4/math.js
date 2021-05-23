// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
 const lexer = require("./lexer.js"); var grammar = {
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
    {"name": "T", "symbols": ["T", (lexer.has("opMult") ? {type: "opMult"} : opMult), "F"], "postprocess": ([num1, , num2]) => (num1 * num2)},
    {"name": "T", "symbols": ["T", (lexer.has("opIntDiv") ? {type: "opIntDiv"} : opIntDiv), "F"], "postprocess": ([num1, , num2]) => (Math.floor(num1 / num2))},
    {"name": "T", "symbols": ["T", (lexer.has("opDiv") ? {type: "opDiv"} : opDiv), "F"], "postprocess": ([num1, , num2]) => (num1 / num2)},
    {"name": "T", "symbols": ["T", (lexer.has("opMod") ? {type: "opMod"} : opMod), "F"], "postprocess": ([num1, , num2]) => (num1 % num2)},
    {"name": "E", "symbols": ["T"], "postprocess": ([expr]) => expr},
    {"name": "T", "symbols": ["F"], "postprocess": ([expr]) => expr},
    {"name": "T", "symbols": [(lexer.has("lp") ? {type: "lp"} : lp), "E", (lexer.has("rp") ? {type: "rp"} : rp)], "postprocess": ([, num, ]) => Number(num)},
    {"name": "F", "symbols": [(lexer.has("lp") ? {type: "lp"} : lp), "E", (lexer.has("rp") ? {type: "rp"} : rp)], "postprocess": ([, num, ]) => Number(num)},
    {"name": "F", "symbols": [(lexer.has("opSub") ? {type: "opSub"} : opSub), (lexer.has("lp") ? {type: "lp"} : lp), "E", (lexer.has("rp") ? {type: "rp"} : rp)], "postprocess": ([, , num, ]) => (Number(num) * -1)},
    {"name": "F", "symbols": ["N"], "postprocess": ([num]) => Number(num)},
    {"name": "F", "symbols": [(lexer.has("opSub") ? {type: "opSub"} : opSub), "N"], "postprocess": ([, num]) => (Number(num) * -1)},
    {"name": "N", "symbols": [(lexer.has("number") ? {type: "number"} : number)]}
]
  , ParserStart: "E"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
