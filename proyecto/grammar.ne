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
    ["void", value => (value === null || typeof(value) === "undefined")], // typeof(null) = 'object' instead of 'null'
    ["int", value => (typeof(value) === "number" && Number.isInteger(value))],
    ["double", value => (typeof(value) === "number" && !Number.isInteger(value))],
    ["char", value => (typeof(value) === "string" && value.length === 1)],
    ["byte", value => (typeof(value) === "number" && value >= 0 && value <= 255)],
    ["_", value => true],
    ["any", value => true],
]);

const getAtomTypeChecker = type => (CHECKERS.get(type));
%}

@lexer lexer

# Main
E -> atom {% ([x]) => x %}
E -> regularExpr {% ([x]) => x %}
E -> group {% ([x]) => x %}
E -> negation {% ([x]) => x %}
E -> conjunction {% ([x]) => x %}
E -> disjunction {% ([x]) => x %}
E -> minus {% ([x]) => x %}
E -> inclusion {% ([x]) => x %}
# E -> L {% ([expr]) => expr %}

# Atoms
atom -> %number {% ([type]) => getAtomTypeChecker(type.value) %}
atom -> %xundefined {% ([type]) => getAtomTypeChecker(type.value) %}
atom -> %boolean {% ([type]) => getAtomTypeChecker(type.value) %}
atom -> %string {% ([type]) => getAtomTypeChecker(type.value) %}
atom -> %xfunction {% ([type]) => getAtomTypeChecker(type.value) %}
atom -> %object {% ([type]) => getAtomTypeChecker(type.value) %}
atom -> %symbol {% ([type]) => getAtomTypeChecker(type.value) %}
atom -> %bigint {% ([type]) => getAtomTypeChecker(type.value) %}
atom -> %xvoid {% ([type]) => getAtomTypeChecker(type.value) %}
atom -> %int {% ([type]) => getAtomTypeChecker(type.value) %}
atom -> %double {% ([type]) => getAtomTypeChecker(type.value) %}
atom -> %char {% ([type]) => getAtomTypeChecker(type.value) %}
atom -> %byte {% ([type]) => getAtomTypeChecker(type.value) %}
atom -> %any {% ([type]) => getAtomTypeChecker(type.value) %}

# in [value1, value2]
inclusion -> %xin %array {% ([xin, array]) => {
    // Note: we're deserializing here on purpose
    // so that any syntax error gets triggered
    // while parsing a "type", and not while
    // checking for a value
    let arrayValues = JSON.parse(array.value);
    return ((value) => arrayValues.includes(value));
} %}

# /{regexp}/
regularExpr -> %regexp {% ([regExp]) => ((value) => new RegExp(regExp.value.slice(1,-1)).test(value.toString())) %}

# (type)
group -> %lp E %rp {% ([lp, expr, rp]) => expr %}

# !type
negation -> %not E {% ([not, typeChecker]) => ((value) => (!typeChecker(value))) %}

# type1 & type2
conjunction -> E %and E {% ([typeChecker1, and, typeChecker2]) => ((value) => (typeChecker1(value) && typeChecker2(value))) %}

# type1 | type2
disjunction -> E %or E {% ([typeChecker1, or, typeChecker2]) => ((value) => (typeChecker1(value) || typeChecker2(value))) %}

# type1 - type2
minus -> E %sub E {% ([typeChecker1, sub, typeChecker2]) => ((value) => (typeChecker1(value) && !typeChecker2(value))) %}