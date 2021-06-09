// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const lexer = require("./lexer.js");

const CHECKERS = new Map([
    ['number', a => typeof(a) == "number"],
]);

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([type]) => ({"type": "number", "checker": CHECKERS.get("number")})}
]
  , ParserStart: "number"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
