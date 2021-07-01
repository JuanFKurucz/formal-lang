@{%
const lexer = require("./lexer.js");

const atomCheckers = new Map([
    ["number", (value, instance) => {
        return (typeof(value) === "number");
    }],
    ["boolean", (value, instance) => {
        return (typeof(value) === "boolean");
    }],
    ["string", (value, instance) => {
        return (typeof(value) === "string");
    }],
    ["undefined", (value, instance) => typeof(value) === "undefined"],
    ["function", (value, instance) => typeof(value) === "function"],
    ["object", (value, instance) => typeof(value) === "object"],
    ["symbol", (value, instance) => typeof(value) === "symbol"],
    ["bigint", (value, instance) => typeof(value) === "bigint"],
    ["void", (value, instance) => (value === null || typeof(value) === "undefined")], // typeof(null) = 'object' instead of 'null'
    ["int", (value, instance) => (typeof(value) === "number" && Number.isInteger(value))],
    ["double", (value, instance) => (typeof(value) === "number" && !Number.isInteger(value))],
    ["char", (value, instance) => (typeof(value) === "string" && value.length === 1)],
    ["byte", (value, instance) => (typeof(value) === "number" && value >= 0 && value <= 255 && parseInt(value) === value)],
    ["int8", (value, instance) => typeof(value) === "number" && value>=-128 && value<=127 && parseInt(value) === value],
    ["uint8", (value, instance) => typeof(value) === "number" && value>=0 && value<=255 && parseInt(value) === value],
    ["int16", (value, instance) => typeof(value) === "number" && value>=-32768 && value<=32767 && parseInt(value) === value],
    ["uint16", (value, instance) => typeof(value) === "number" && value>=0 && value<=65535 && parseInt(value) === value],
    ["int32", (value, instance) => typeof(value) === "number" && value>=-2147483648 && value<=2147483647 && parseInt(value) === value],
    ["uint32", (value, instance) => typeof(value) === "number" && value>=0 && value<=4294967295 && parseInt(value) === value],
    ["_", (value, instance) => true],
    ["any", (value, instance) => true],
]);

const atomChecker = type => (atomCheckers.get(type));

const iterationChecker = typeCheckers => {
    return ((checkValues, instance) => {

        // Copy original values
        let values = Array.from(checkValues);

        let v = 0; // index of current value
        for (let c = 0; c < typeCheckers.length; c++) {
            const currentChecker = typeCheckers[c]; // current checker function

            switch (typeCheckers[c].type) {
                case "zeroPlus":
                    if (values[v] === undefined) break;

                    // Try to check until it finds a mismatch
                    while (currentChecker.checker(values[v], instance)) {
                        v++;
                        if (values[v] === undefined) break;
                    };
                    break;
                case "one":
                    if (values[v] === undefined) return false;              // No values left so it's a mismatch
                    if (!currentChecker.checker(values[v], instance)) return false;   // Value doesn't match type
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
const matchKeysWithCheckers = (object, typeCheckerPair, instance) => {
    let count = 0;
    const checkers = typeCheckerPair.checkerPair;
    let keysToRemove = [];

    // Check for key/value
    for (const [key, value] of Object.entries(object)) {
        if (checkers[0](key, instance) && checkers[1](value, instance)) {
            count++;
            keysToRemove.push(key);
        }
    }
    
    // Remove keys
    for (const key of keysToRemove) delete object[key];

    return count;
};

const objectChecker = typeCheckerPairs => {
    return ((checkObject, instance) => {
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
                    matchCount = matchKeysWithCheckers(object, currentCheckerPair, instance);

                    // For those types we should always match
                    // exactly one key
                    if (matchCount != 1) return false;
                    break;

                case "nRegex":
                    matchCount = matchKeysWithCheckers(object, currentCheckerPair, instance);

                    // For this type we should always match
                    // exactly "n" (from ...n * /re/)
                    if (matchCount != currentCheckerPair.count) return false;
                    break;

                case "zeroPlusRegex":
                    // For this type we just remove everything we
                    // can and we don't care about its count
                    matchKeysWithCheckers(object, currentCheckerPair, instance);
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
T -> customChecker {% ([x]) => x %}

# Atoms
atom -> %xnumber {% ([type]) => atomChecker(type.value) %}
atom -> %xundefined {% ([type]) => atomChecker(type.value) %}
atom -> %xboolean {% ([type]) => atomChecker(type.value) %}
atom -> %xstring {% ([type]) => atomChecker(type.value) %}
atom -> %xfunction {% ([type]) => atomChecker(type.value) %}
atom -> %object {% ([type]) => atomChecker(type.value) %}
atom -> %symbol {% ([type]) => atomChecker(type.value) %}
atom -> %bigint {% ([type]) => atomChecker(type.value) %}
atom -> %xvoid {% ([type]) => atomChecker(type.value) %}
atom -> %int {% ([type]) => atomChecker(type.value) %}
atom -> %int8 {% ([type]) => atomChecker(type.value) %}
atom -> %uint8 {% ([type]) => atomChecker(type.value) %}
atom -> %int16 {% ([type]) => atomChecker(type.value) %}
atom -> %uint16 {% ([type]) => atomChecker(type.value) %}
atom -> %int32 {% ([type]) => atomChecker(type.value) %}
atom -> %uint32 {% ([type]) => atomChecker(type.value) %}
atom -> %float32 {% ([type]) => atomChecker(type.value) %}
atom -> %bigint64 {% ([type]) => atomChecker(type.value) %}
atom -> %biguint64 {% ([type]) => atomChecker(type.value) %}
atom -> %double {% ([type]) => atomChecker(type.value) %}
atom -> %char {% ([type]) => atomChecker(type.value) %}
atom -> %byte {% ([type]) => atomChecker(type.value) %}
atom -> %any {% ([type]) => atomChecker(type.value) %}

# in [value1, value2]
inclusion -> %xin %lsb values %rsb {% ([ , , values, ]) => {
    return ((value, instance) => values.includes(value));
} %}

values -> values %separator value {% ([values, , value]) => { return [...values, ...value]; } %}
values -> value {% ([value]) => { return value; } %}
value -> %boolean {% ([token]) => [JSON.parse(token.value)] %}
value -> %string {% ([token]) => [JSON.parse(token.value)] %}
value -> %number {% ([token]) => [Number(token.value)] %}

# javascript values (string, boolean or number)
valueCheck -> %boolean {% ([token]) => ((value, instance) => (value === JSON.parse(token.value))) %}
valueCheck -> %string {% ([token]) => ((value, instance) => (value === JSON.parse(token.value))) %}
valueCheck -> %number {% ([token]) => ((value, instance) => {
    return (value == Number(token.value) || (isNaN(value) && isNaN(Number(token.value))));
}) %}

# /{regexp}/
regularExpr -> %regexp {% ([regExp]) => ((value, instance) => {
    return (new RegExp(regExp.value.slice(1,-1)).test(value.toString()));
}) %}

# (type)
group -> %lp T %rp {% ([lp, expr, rp]) => expr %}

# !type
negation -> %not T {% ([not, typeChecker]) => ((value, instance) => (!typeChecker(value, instance))) %}

# type1 & type2
conjunction -> T %and T {% ([typeChecker1, and, typeChecker2]) => ((value, instance) => (typeChecker1(value, instance) && typeChecker2(value, instance))) %}

# type1 | type2
disjunction -> T %or T {% ([typeChecker1, or, typeChecker2]) => ((value, instance) => (typeChecker1(value, instance) || typeChecker2(value, instance))) %}

# type1 - type2
minus -> T %sub T {% ([typeChecker1, sub, typeChecker2]) => ((value, instance) => (typeChecker1(value, instance) && !typeChecker2(value, instance))) %}

# [...]
list -> %lsb %spread %rsb {% ([lsb, spread, rsb]) => ((values, instance) => Array.isArray(values)) %}

# [type1, type2, type3]
list -> %lsb listValues %rsb {% ([, typeCheckers, ]) => iterationChecker(typeCheckers) %}
listValues -> listValues %separator listValue {% ([typeCheckers, , typeChecker]) => {
    return [...typeCheckers, ...typeChecker];
} %}
listValues -> listValue {% ([type]) => type %}
# [...n * type]
listValue -> %spread %number %mult T {% ([ , n, , typeChecker]) => {
    n == parseInt(n).toString() || (function() { throw `Invalid spread integer "${n}"` }());

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
objectProp -> %spread %number %mult regularExpr %colon T {% ([, n, , typeChecker1, , typeChecker2]) => {
    n == parseInt(n).toString() || (function() { throw `Invalid spread integer "${n}"` }());

    return [{
        checkerPair: [
            typeChecker1,
            typeChecker2
        ],
        type: "nRegex",
        count: parseInt(n)
    }];
} %}

# $n
customChecker -> %pe %number {% ([ , index]) => {
    index == parseInt(index).toString() || (function() { throw `Invalid checker index "${index}"` }());

    return ((values, instance) => {
        const customTypeChecker = instance.checkers[parseInt(index)];
        customTypeChecker || (function() { throw `Invalid custom checker index ${index}` }());
        return customTypeChecker(values);
    });
} %}

# Class
classConstructor -> dynamicName {% ([typeChecker]) => typeChecker %}
# Class<type1, typeN>
classConstructor -> %identifier %lt classCheckers %gt {% ([name, , typeCheckers, ]) => {
    const className = name.value;
    return ((values, instance) => {
        const clazz = instance.getClassChecker()[className]; // [Class, Fun]
        clazz || (function() { throw `Invalid class name "${className}"` }());
        return values instanceof clazz[0] && clazz[1](values, typeCheckers);
    });
} %}
classCheckers -> classChecker {% ([type]) => type %}
classCheckers -> classCheckers %separator classChecker {% ([typeCheckers, , typeChecker]) => {
    return [...typeCheckers, ...typeChecker];
} %}
classChecker -> T {% ([typeChecker]) => [typeChecker] %}
dynamicName -> %identifier {% ([name]) => {
    const className = name.value;
    return ((value, instance) => {
        const clazz = instance.getClassChecker()[className]; // [Class, Fun]
        clazz || (function() { throw `Invalid class name "${className}"` }());
        return value instanceof clazz[0];
    });
} %}