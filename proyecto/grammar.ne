@{%

// TODO: Comentar todos los console logs!!!

const lexer = require("./lexer.js");

const atomCheckers = new Map([
    ["number", value => typeof(value) === "number"],
    ["undefined", value => typeof(value) === "undefined"],
    ["boolean", value => {
        return (typeof(value) === "boolean");
    }],
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

const atomChecker = type => (atomCheckers.get(type));

const iterationChecker = typeCheckers => {
    return (values => {

        // TODO: casos particulares:
        // - si es Map, lo transformamos en lista de listas
        // - si es set, transformamos en lista

        let v = 0; // index of current value
        for (let c = 0; c < typeCheckers.length; c++) {
            const currentChecker = typeCheckers[c]; // current checker function

            switch (typeCheckers[c].type) {
                case "zeroPlus":
                    if (values[v] === undefined) break;

                    // Try to check until it finds a mismatch
                    while (currentChecker.checker(values[v])) {
                        v++;
                        if (values[v] === undefined) break;
                    };
                    break;
                case "one":
                    if (values[v] === undefined) return false;              // No values left so it's a mismatch
                    if (!currentChecker.checker(values[v])) return false;   // Value doesn't match type
                    v++;
                    break;
            }
        }
        return values.length == 0 ? true : (v == values.length);
    })
}
%}

@lexer lexer

# Main
E -> T {% ([expr]) => expr %}
# E -> I {% ([expr]) => expr %}
E -> O {% ([expr]) => expr %}

# Types and their combinations
T -> atom {% ([x]) => x %}
T -> regularExpr {% ([x]) => x %}
T -> group {% ([x]) => x %}
T -> negation {% ([x]) => x %}
T -> conjunction {% ([x]) => x %}
T -> disjunction {% ([x]) => x %}
T -> minus {% ([x]) => x %}
T -> inclusion {% ([x]) => x %}
T -> valueCheck {% ([x]) => x %}
T -> list {% ([x]) => x %}
T -> objectConstruct {% ([x]) => x %}

# Iterables
# I -> list {% ([expr]) => expr %}

# Objects
O -> object {% ([expr]) => expr %}

# TODO: mover
objectConstruct -> %upperCaseChar {% ([type]) => atomChecker(type.value) %}

# Atoms
atom -> %number {% ([type]) => atomChecker(type.value) %}
atom -> %xundefined {% ([type]) => atomChecker(type.value) %}
atom -> %boolean {% ([type]) => atomChecker(type.value) %}
atom -> %string {% ([type]) => atomChecker(type.value) %}
atom -> %xfunction {% ([type]) => atomChecker(type.value) %}
atom -> %object {% ([type]) => atomChecker(type.value) %}
atom -> %symbol {% ([type]) => atomChecker(type.value) %}
atom -> %bigint {% ([type]) => atomChecker(type.value) %}
atom -> %xvoid {% ([type]) => atomChecker(type.value) %}
atom -> %int {% ([type]) => atomChecker(type.value) %}
atom -> %double {% ([type]) => atomChecker(type.value) %}
atom -> %char {% ([type]) => atomChecker(type.value) %}
atom -> %byte {% ([type]) => atomChecker(type.value) %}
atom -> %any {% ([type]) => atomChecker(type.value) %}

# in [value1, value2]
inclusion -> %xin %lsb values %rsb {% ([ , , values, ]) => {
    return ((value) => values.includes(value));
} %}

values -> values %separator value {% ([values, , value]) => { return [...values, ...value]; } %}
values -> value {% ([value]) => { return value; } %}
# TODO: agregar %strings y %numbers
value -> %booleans {% ([token]) => {
    // Note: we're deserializing here on purpose
    // in order to throw an error while parsing
    return [JSON.parse(token.value)];
} %}

# javascript values (string, boolean or number)
# TODO: agregar %strings y %numbers
valueCheck -> %booleans {% ([token]) => ((value) => (value === JSON.parse(token.value))) %}

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

# [...]
list -> %lsb %spread %rsb {% ([lsb, spread, rsb]) => ((values) => Array.isArray(values)) %}

# TODO: preguntar si tenemos que revisar que no se repitan o simplemente dejar que retorne false
# los tipos. Por ej. (...type1, type1, type2), acá type1 es ambiguo
# non-any list
# e.g.: [boolean, ...string, boolean]
list -> %lsb listValues %rsb {% ([, typeCheckers, ]) => iterationChecker(typeCheckers) %}
listValues -> listValues %separator listValue {% ([typeCheckers, , typeChecker]) => {
    return [...typeCheckers, ...typeChecker];
} %}
listValues -> listValue {% ([type]) => type %}
# ...n * type
listValue -> %spread %integer %mult T {% ([ , n, , typeChecker]) => {
    // Just append it n times
    return Array(parseInt(n)).fill({
        checker: typeChecker,
        type: "one"
    });
} %}
# ...type
listValue -> %spread T {% ([ , typeChecker]) => {
    return [{
        checker: typeChecker,
        type: "zeroPlus"
    }];
} %}
# any type, values or their combinations (any "T")
listValue -> T {% ([typeChecker]) => {
    return [{
        checker: typeChecker,
        type: "one"
    }];
} %}