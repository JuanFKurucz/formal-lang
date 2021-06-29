@{%

// TODO: Comentar todos los console logs!!!
// TODO: ver todos los TODOs que hayan por ahí

const lexer = require("./lexer.js");

const atomCheckers = new Map([
    ["number", value => {
        return (typeof(value) === "number");
    }],
    ["boolean", value => {
        return (typeof(value) === "boolean");
    }],
    ["string", value => {
        return (typeof(value) === "string");
    }],
    ["undefined", value => typeof(value) === "undefined"],
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
    return (checkValues => {
        // Copies values and also converts Map,
        // and Set to a regular Array
        // Note: this is needed because we are
        // re-using this function check for Maps
        // and Sets, not just Arrays
        let values = checkValues instanceof Map
                    ? Array.from(checkValues.entries())
                    : Array.from(checkValues);

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

const objectPropChecker = (name, typeChecker, parseKey) => {
    const propChecker = keyName => {
        return keyName == (parseKey ? JSON.parse(name) : name);
    };
    return [{
        checkerPair: [
            propChecker,
            typeChecker
        ],
        type: "one"
    }];
};

// Matches a checker function pair with an object's key/value
// It removes the key for each match and also returns the count
// of removed keys, which is useful to compare on each type.
// E.g. for checker types:
// - "one" should and will count 1 (because objects won't allow duplicates)
// - "oneRegex" should count 1, but it might remove more than one key
// - "zeroPlusRegex" would accept any count, might remove zero or more
const matchKeysWithCheckers = (object, typeCheckerPair) => {
    let count = 0;
    const checkers = typeCheckerPair.checkerPair;
    let keysToRemove = [];

    // Check for key/value
    for (const [key, value] of Object.entries(object)) {
        if (checkers[0](key) && checkers[1](value)) {
            count++;
            keysToRemove.push(key);
        }
    }
    
    // Remove keys
    for (const key of keysToRemove) delete object[key];

    return count;
};

const objectChecker = typeCheckerPairs => {
    return (checkObject => {
        if (typeof checkObject != "object") return false;

        // Copy of original object. because we
        // might remove some keys
        let object = {...checkObject};

        // If we have a spread in our checkers,
        // an object is valid even if it has
        // some keys left to check, otherwise
        // all keys must be checked and removed
        let spreadFound = false;

        for (let c = 0; c < typeCheckerPairs.length; c++) {
            const currentCheckerPair = typeCheckerPairs[c]; // current checker pair functions
            let matchCount = 0;

            switch (typeCheckerPairs[c].type) {
                case "oneRegex":
                case "one":
                    matchCount = matchKeysWithCheckers(object, currentCheckerPair);

                    // For those types we should always match
                    // exactly one key
                    if (matchCount != 1) return false;
                    break;

                case "nRegex":
                    matchCount = matchKeysWithCheckers(object, currentCheckerPair);

                    // For this type we should always match
                    // exactly "n" (from ...n * /re/)
                    if (matchCount != currentCheckerPair.count) return false;
                    break;

                case "zeroPlusRegex":
                    // For this type we just remove everything we
                    // can and we don't care about its count
                    matchKeysWithCheckers(object, currentCheckerPair);
                    break;

                case "spread":
                    spreadFound = true;
            }
        }
        return spreadFound ? true : Object.keys(object).length == 0;
    })
}
%}

@lexer lexer

# Main
E -> T {% ([expr]) => expr %}

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
T -> object {% ([x]) => x %}
T -> classConstructor {% ([x]) => x %}

# Atoms
atom -> %xnumber {% ([type]) => atomChecker(type.value) %}
atom -> %xundefined {% ([type]) => atomChecker(type.value) %}
atom -> %boolean {% ([type]) => atomChecker(type.value) %}
atom -> %xstring {% ([type]) => atomChecker(type.value) %}
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
# TODO: agregar %string y %number
value -> %booleans {% ([token]) => {
    // Note: we're deserializing here on purpose
    // in order to throw an error while parsing
    return [JSON.parse(token.value)];
} %}

# javascript values (string, boolean or number)
# TODO: agregar %string y %number
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

# [type1, type2, type3]
list -> %lsb listValues %rsb {% ([, typeCheckers, ]) => iterationChecker(typeCheckers) %}
listValues -> listValues %separator listValue {% ([typeCheckers, , typeChecker]) => {
    return [...typeCheckers, ...typeChecker];
} %}
listValues -> listValue {% ([type]) => type %}
# [...n * type]
listValue -> %spread %integer %mult T {% ([ , n, , typeChecker]) => {
    // Just append it n times
    return Array(parseInt(n)).fill({
        checker: typeChecker,
        type: "one"
    });
} %}
# [...type]
listValue -> %spread T {% ([ , typeChecker]) => {
    return [{
        checker: typeChecker,
        type: "zeroPlus"
    }];
} %}
# [type]
listValue -> T {% ([typeChecker]) => {
    return [{
        checker: typeChecker,
        type: "one"
    }];
} %}

# { prop1: type1, prop2: type2 }
object -> %lb objectProps %rb {% ([, typeCheckerPairs, ]) => objectChecker(typeCheckerPairs) %}
objectProps -> objectProps %separator objectProp {% ([typeCheckerPairs, , typeCheckerPair]) => {
    return [...typeCheckerPairs, ...typeCheckerPair];
} %}
objectProps -> objectProp {% ([prop]) => prop %}

# {...}
objectProp -> %spread {% ([]) => {
    return [{
        checkerPair: [],
        type: "spread"
    }];
} %}
# {prop: type}
objectProp -> %identifier %colon T {% ([name, , typeChecker]) => objectPropChecker(name, typeChecker, false) %}
# {"prop": type}
objectProp -> %string %colon T {% ([name, , typeChecker]) => objectPropChecker(name, typeChecker, true) %}
# {/re/: type}
objectProp -> regularExpr %colon T {% ([typeChecker1, , typeChecker2]) => {
    return [{
        checkerPair: [
            typeChecker1,
            typeChecker2
        ],
        type: "oneRegex"
    }];
} %}
# {.../re/: type}
objectProp -> %spread regularExpr %colon T {% ([, typeChecker1, , typeChecker2]) => {
    return [{
        checkerPair: [
            typeChecker1,
            typeChecker2
        ],
        type: "zeroPlusRegex"
    }];
} %}
# {...n * /re/: type}
objectProp -> %spread %integer %mult regularExpr %colon T {% ([, n, , typeChecker1, , typeChecker2]) => {
    return [{
        checkerPair: [
            typeChecker1,
            typeChecker2
        ],
        type: "nRegex",
        count: parseInt(n)
    }];
} %}

# Class
classConstructor -> dynamicName {% ([typeChecker]) => typeChecker %}
# Class<type>
classConstructor -> dynamicName %lt T %gt {% ([typeChecker1, , typeChecker2, ]) => {
    // Iteration checker for a [...type]
    let iterableChecker = iterationChecker([{
        checker: typeChecker2,
        type: "zeroPlus"
    }]);
    return ((values) => typeChecker1(values) && iterableChecker(values));
} %}
# Class<type1, type2>
classConstructor -> dynamicName %lt T %separator T %gt {% ([typeChecker1, , typeChecker2, , typeChecker3, ]) => {
    // Iteration checker for a [...[type1, type2]]
    let iterableChecker = iterationChecker([{
        checker: (values => {
            return typeChecker2(values[0]) && typeChecker3(values[1]);
        }),
        type: "zeroPlus"
    }]);
    return ((values) => typeChecker1(values) && iterableChecker(values));
} %}
# TODO: ver qué tan rancio es esto
dynamicName -> %identifier {% ([name]) => {
    let className = name.value;

    if (className.charAt(0) !== className.charAt(0).toUpperCase()) {
        throw new SyntaxError(`Invalid type "${className}"`);
    }

    // Hack-ish way to check if a class actually exists
    eval(`${className}.name`);

    return ((value) => eval(`value instanceof ${className}`));
} %}