// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const lexer = require("./lexer.js");

const FUNCTIONS = new Map([
  ['max', Math.max],
  ['min', Math.min],
]);

// const max = Math.max.apply(null, numbers);

const __argsToList = function(args) {
    if (!args) return [];

    // Flat array (max nesting) and then only
    // keep non-objects (e.g. discard %argSeparator)
    // that weren't evaluated
    return args.flat(Infinity).filter((val) => !val.type);
};

const callFunc = function(name, args) {
    const argsList = __argsToList(args);
    let fun = FUNCTIONS.get(name.value); // TODO: Por qué no me toma el name.toString()???
    if (fun) {
        // Call dynamic function and return
        return fun.apply(null, argsList);
    } else {
        throw Error(`Undefined function name: ${name.value}`);
    }
};

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
    {"name": "T$ebnf$1", "symbols": ["A"], "postprocess": id},
    {"name": "T$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "T", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), (lexer.has("lp") ? {type: "lp"} : lp), "T$ebnf$1", (lexer.has("rp") ? {type: "rp"} : rp)], "postprocess": ([name, , args, ]) => callFunc(name, args)},
    {"name": "A", "symbols": ["E"]},
    {"name": "A", "symbols": ["A", (lexer.has("argSeparator") ? {type: "argSeparator"} : argSeparator), "E"]},
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
    {"name": "F", "symbols": ["N"], "postprocess": ([num]) => Number(num)},
    {"name": "F", "symbols": [(lexer.has("opSub") ? {type: "opSub"} : opSub), "N"], "postprocess": ([, num]) => (Number(num) * -1)},
    {"name": "F", "symbols": [(lexer.has("opSub") ? {type: "opSub"} : opSub), "B"], "postprocess": ([, bool]) => (bool * -1)},
    {"name": "F", "symbols": ["B"], "postprocess": ([bool]) => (bool)},
    {"name": "N", "symbols": [(lexer.has("number") ? {type: "number"} : number)]},
    {"name": "B", "symbols": [(lexer.has("boolean") ? {type: "boolean"} : boolean)], "postprocess": ([bool]) => (bool == "true")}
]
  , ParserStart: "E"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
