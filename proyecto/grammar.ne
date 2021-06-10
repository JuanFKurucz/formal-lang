@{%
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
%}

@lexer lexer
atom -> %number {% ([type]) => getAtomType(type.value) %}
atom -> %xundefined {% ([type]) => getAtomType(type.value) %}
atom -> %boolean {% ([type]) => getAtomType(type.value) %}
atom -> %string {% ([type]) => getAtomType(type.value) %}
atom -> %xfunction {% ([type]) => getAtomType(type.value) %}
atom -> %object {% ([type]) => getAtomType(type.value) %}
atom -> %symbol {% ([type]) => getAtomType(type.value) %}
atom -> %bigint {% ([type]) => getAtomType(type.value) %}
atom -> %xvoid {% ([type]) => getAtomType(type.value) %}
atom -> %int {% ([type]) => getAtomType(type.value) %}
atom -> %double {% ([type]) => getAtomType(type.value) %}
atom -> %char {% ([type]) => getAtomType(type.value) %}
atom -> %byte {% ([type]) => getAtomType(type.value) %}
atom -> %any {% ([type]) => getAtomType(type.value) %}