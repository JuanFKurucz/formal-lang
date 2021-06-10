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

const getAtomType = type => ({"type": type, "checker": CHECKERS.get(type)});
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "atom", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([type]) => getAtomType(type.value)},
    {"name": "atom", "symbols": [(lexer.has("xundefined") ? {type: "xundefined"} : xundefined)], "postprocess": ([type]) => getAtomType(type.value)},
    {"name": "atom", "symbols": [(lexer.has("boolean") ? {type: "boolean"} : boolean)], "postprocess": ([type]) => getAtomType(type.value)},
    {"name": "atom", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": ([type]) => getAtomType(type.value)},
    {"name": "atom", "symbols": [(lexer.has("xfunction") ? {type: "xfunction"} : xfunction)], "postprocess": ([type]) => getAtomType(type.value)},
    {"name": "atom", "symbols": [(lexer.has("object") ? {type: "object"} : object)], "postprocess": ([type]) => getAtomType(type.value)},
    {"name": "atom", "symbols": [(lexer.has("symbol") ? {type: "symbol"} : symbol)], "postprocess": ([type]) => getAtomType(type.value)},
    {"name": "atom", "symbols": [(lexer.has("bigint") ? {type: "bigint"} : bigint)], "postprocess": ([type]) => getAtomType(type.value)},
    {"name": "atom", "symbols": [(lexer.has("xvoid") ? {type: "xvoid"} : xvoid)], "postprocess": ([type]) => getAtomType(type.value)},
    {"name": "atom", "symbols": [(lexer.has("int") ? {type: "int"} : int)], "postprocess": ([type]) => getAtomType(type.value)},
    {"name": "atom", "symbols": [(lexer.has("double") ? {type: "double"} : double)], "postprocess": ([type]) => getAtomType(type.value)},
    {"name": "atom", "symbols": [(lexer.has("char") ? {type: "char"} : char)], "postprocess": ([type]) => getAtomType(type.value)},
    {"name": "atom", "symbols": [(lexer.has("byte") ? {type: "byte"} : byte)], "postprocess": ([type]) => getAtomType(type.value)},
    {"name": "atom", "symbols": [(lexer.has("any") ? {type: "any"} : any)], "postprocess": ([type]) => getAtomType(type.value)}
]
  , ParserStart: "atom"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();