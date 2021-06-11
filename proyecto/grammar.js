// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const lexer = require("./lexer.js");

const CHECKERS = new Map([
    ["number", value => typeof(value) === "number"],
    ["undefined", value => typeof(value) === "undefined"],
    ["boolean", value => typeof(value) === "boolean"],
    ["string", value => typeof(value) === "string"],
    ["function", value => typeof(value) === "function"],
    ["object", value => typeof(value) === "object"],
    ["symbol", value => typeof(value) === "symbol"],
    ["bigint", value => typeof(value) === "bigint"],
    ["void", value => (value === null || typeof(value) === "undefined")], // typeof(null) = 'object', not 'null'
    ["int", value => (typeof(value) === "number" && Number.isInteger(value))],
    ["double", value => (typeof(value) === "number" && !Number.isInteger(value))],
    ["char", value => (typeof(value) === "string" && value.length === 1)],
    ["byte", value => (typeof(value) === "number" && value >= 0 && value <= 255)],
    ["_", value => true],
    ["any", value => true],
]);

const getAtomTypeChecker = type => (CHECKERS.get(type));
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "E", "symbols": ["atom"], "postprocess": ([x]) => x},
    {"name": "E", "symbols": ["regularExpr"], "postprocess": ([x]) => x},
    {"name": "E", "symbols": ["group"], "postprocess": ([x]) => x},
    {"name": "E", "symbols": ["negation"], "postprocess": ([x]) => x},
    {"name": "E", "symbols": ["conjunction"], "postprocess": ([x]) => x},
    {"name": "E", "symbols": ["disjunction"], "postprocess": ([x]) => x},
    {"name": "E", "symbols": ["minus"], "postprocess": ([x]) => x},
    {"name": "atom", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("xundefined") ? {type: "xundefined"} : xundefined)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("boolean") ? {type: "boolean"} : boolean)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("xfunction") ? {type: "xfunction"} : xfunction)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("object") ? {type: "object"} : object)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("symbol") ? {type: "symbol"} : symbol)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("bigint") ? {type: "bigint"} : bigint)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("xvoid") ? {type: "xvoid"} : xvoid)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("int") ? {type: "int"} : int)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("double") ? {type: "double"} : double)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("char") ? {type: "char"} : char)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("byte") ? {type: "byte"} : byte)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("any") ? {type: "any"} : any)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "regularExpr", "symbols": [(lexer.has("regexp") ? {type: "regexp"} : regexp)], "postprocess": ([regExp]) => ((value) => new RegExp(regExp.value.slice(1,-1)).test(value.toString()))},
    {"name": "group", "symbols": [(lexer.has("lp") ? {type: "lp"} : lp), "E", (lexer.has("rp") ? {type: "rp"} : rp)], "postprocess": ([lp, expr, rp]) => expr},
    {"name": "negation", "symbols": [(lexer.has("not") ? {type: "not"} : not), "E"], "postprocess": ([not, typeChecker]) => ((value) => (!typeChecker(value)))},
    {"name": "conjunction", "symbols": ["E", (lexer.has("and") ? {type: "and"} : and), "E"], "postprocess": ([typeChecker1, and, typeChecker2]) => ((value) => (typeChecker1(value) && typeChecker2(value)))},
    {"name": "disjunction", "symbols": ["E", (lexer.has("or") ? {type: "or"} : or), "E"], "postprocess": ([typeChecker1, or, typeChecker2]) => ((value) => (typeChecker1(value) || typeChecker2(value)))},
    {"name": "minus", "symbols": ["E", (lexer.has("sub") ? {type: "sub"} : sub), "E"], "postprocess": ([typeChecker1, sub, typeChecker2]) => ((value) => (typeChecker1(value) && !typeChecker2(value)))}
]
  , ParserStart: "E"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
