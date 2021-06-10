// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const lexer = require("./lexer.js");

const CHECKERS = new Map([
    ["number", a => typeof(a) === "number"],
    ["string", a => typeof(a) === "string"],
]);

const getAtomType = type => ({"type": type, "checker": CHECKERS.get(type)});

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "atom", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": ([type]) => getAtomType(type.value)},
    {"name": "atom", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([type]) => getAtomType(type.value)}
]
  , ParserStart: "atom"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
