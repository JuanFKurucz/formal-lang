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
    ["byte", value => (typeof(value) === "number" && value >= 0 && value <= 255 && parseInt(value) === value)],
    ["_", value => true],
    ["any", value => true],
]);

const getAtomTypeChecker = type => (CHECKERS.get(type));
%}

@lexer lexer

# TODO generales:
# - ver que valores de JS sean types también

# Main
E -> T {% ([expr]) => expr %}
E -> I {% ([expr]) => expr %}

# Types and their combinations
T -> atom {% ([x]) => x %}
T -> regularExpr {% ([x]) => x %}
T -> group {% ([x]) => x %}
T -> negation {% ([x]) => x %}
T -> conjunction {% ([x]) => x %}
T -> disjunction {% ([x]) => x %}
T -> minus {% ([x]) => x %}
T -> inclusion {% ([x]) => x %}

# Iterables
I -> zeroPlusList {% ([expr]) => expr %}
I -> threeList {% ([threeList]) => threeList %}

# TODO: move down
# TODO: Esto y los [type1, type2, type3] hay que cambiarlos un poco para que se resuelva
# con [ %separator ] y busque todos los tipos. Por ej. ...type sería
# [...type]
zeroPlusList -> %lsb %spread T %rsb {% ([lsb, spread, typeChecker, rsb]) =>
    (values) => {
        return values.reduce(((acc, value) => (acc && typeChecker(value))), true) || false
    }
%}
# []
zeroPlusList -> %lsb %spread %rsb {% ([lsb, spread, rsb]) => ((values) => Array.isArray(values)) %}
# [...]
zeroPlusList -> %lsb %spread %any %rsb {% ([lsb, spread, rsb]) => ((values) => Array.isArray(values)) %}

# [type1, type2, type3]
threeList -> %lsb T %separator T %separator T %separator %rsb {% ([lsb, t1, t2, t3, rsb]) => (
    ([v1, v2, v3]) => t1(v1) && t2(v2) && t3(v3)
) %}


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
inclusion -> %xin %lsb values:+ %rsb {% ([ xin, lsb, values, rsb]) => {
    // Note: we're deserializing here on purpose
    // in order to throw an error while parsing
    // console.log(`inclusion: ${JSON.stringify(values)}`);
    // console.log(JSON.stringify(values[0]));
    let arrayValues = values[0];
    return ((value) => arrayValues.includes(value));
} %}

# TODO: agregar %string y %number
values -> values %separator value {% ([values, , value]) => {
    // TODO: ver por qué creó otra lista
    return [...values, ...value];
} %}
values -> value {% ([value]) => { return value; } %}
value -> %booleans {% ([token]) => { return [JSON.parse(token.value)]; } %}

# /{regexp}/
regularExpr -> %regexp {% ([regExp]) => ((value) => {
    return (new RegExp(regExp.value.slice(1,-1)).test(value.toString()));
}) %}

# (type)
group -> %lp T %rp {% ([lp, expr, rp]) => expr %}

# !type
negation -> %not T {% ([not, typeChecker]) => ((value) => (!typeChecker(value))) %}

# type1 & type2
conjunction -> T %and T {% ([typeChecker1, and, typeChecker2]) => ((value) => (typeChecker1(value) && typeChecker2(value))) %}

# type1 | type2
disjunction -> T %or T {% ([typeChecker1, or, typeChecker2]) => ((value) => (typeChecker1(value) || typeChecker2(value))) %}

# type1 - type2
minus -> T %sub T {% ([typeChecker1, sub, typeChecker2]) => ((value) => (typeChecker1(value) && !typeChecker2(value))) %}