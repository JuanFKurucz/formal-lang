@{%
const lexer = require("./lexer.js");

const CHECKERS = new Map([
    ["number", a => typeof(a) === "number"],
    ["string", a => typeof(a) === "string"],
]);

const getAtomType = type => ({"type": type, "checker": CHECKERS.get(type)});
%}

@lexer lexer
atom -> %string {% ([type]) => getAtomType(type.value) %}
atom -> %number {% ([type]) => getAtomType(type.value) %}