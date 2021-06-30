// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

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
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "E", "symbols": ["T"], "postprocess": ([expr]) => expr},
    {"name": "T", "symbols": ["atom"], "postprocess": ([x]) => x},
    {"name": "T", "symbols": ["regularExpr"], "postprocess": ([x]) => x},
    {"name": "T", "symbols": ["group"], "postprocess": ([x]) => x},
    {"name": "T", "symbols": ["negation"], "postprocess": ([x]) => x},
    {"name": "T", "symbols": ["conjunction"], "postprocess": ([x]) => x},
    {"name": "T", "symbols": ["disjunction"], "postprocess": ([x]) => x},
    {"name": "T", "symbols": ["minus"], "postprocess": ([x]) => x},
    {"name": "T", "symbols": ["inclusion"], "postprocess": ([x]) => x},
    {"name": "T", "symbols": ["valueCheck"], "postprocess": ([x]) => x},
    {"name": "T", "symbols": ["list"], "postprocess": ([x]) => x},
    {"name": "T", "symbols": ["object"], "postprocess": ([x]) => x},
    {"name": "T", "symbols": ["classConstructor"], "postprocess": ([x]) => x},
    {"name": "T", "symbols": ["customChecker"], "postprocess": ([x]) => x},
    {"name": "atom", "symbols": [(lexer.has("xnumber") ? {type: "xnumber"} : xnumber)], "postprocess": ([type]) => atomChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("xundefined") ? {type: "xundefined"} : xundefined)], "postprocess": ([type]) => atomChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("xboolean") ? {type: "xboolean"} : xboolean)], "postprocess": ([type]) => atomChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("xstring") ? {type: "xstring"} : xstring)], "postprocess": ([type]) => atomChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("xfunction") ? {type: "xfunction"} : xfunction)], "postprocess": ([type]) => atomChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("object") ? {type: "object"} : object)], "postprocess": ([type]) => atomChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("symbol") ? {type: "symbol"} : symbol)], "postprocess": ([type]) => atomChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("bigint") ? {type: "bigint"} : bigint)], "postprocess": ([type]) => atomChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("xvoid") ? {type: "xvoid"} : xvoid)], "postprocess": ([type]) => atomChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("int") ? {type: "int"} : int)], "postprocess": ([type]) => atomChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("double") ? {type: "double"} : double)], "postprocess": ([type]) => atomChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("char") ? {type: "char"} : char)], "postprocess": ([type]) => atomChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("byte") ? {type: "byte"} : byte)], "postprocess": ([type]) => atomChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("any") ? {type: "any"} : any)], "postprocess": ([type]) => atomChecker(type.value)},
    {"name": "inclusion", "symbols": [(lexer.has("xin") ? {type: "xin"} : xin), (lexer.has("lsb") ? {type: "lsb"} : lsb), "values", (lexer.has("rsb") ? {type: "rsb"} : rsb)], "postprocess":  ([ , , values, ]) => {
            return ((value, instance) => values.includes(value));
        } },
    {"name": "values", "symbols": ["values", (lexer.has("separator") ? {type: "separator"} : separator), "value"], "postprocess": ([values, , value]) => { return [...values, ...value]; }},
    {"name": "values", "symbols": ["value"], "postprocess": ([value]) => { return value; }},
    {"name": "value", "symbols": [(lexer.has("boolean") ? {type: "boolean"} : boolean)], "postprocess": ([token]) => [JSON.parse(token.value)]},
    {"name": "value", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": ([token]) => [JSON.parse(token.value)]},
    {"name": "value", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([token]) => [JSON.parse(token.value)]},
    {"name": "value", "symbols": [(lexer.has("integer") ? {type: "integer"} : integer)], "postprocess": ([token]) => [JSON.parse(token.value)]},
    {"name": "valueCheck", "symbols": [(lexer.has("boolean") ? {type: "boolean"} : boolean)], "postprocess": ([token]) => ((value, instance) => (value === JSON.parse(token.value)))},
    {"name": "valueCheck", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": ([token]) => ((value, instance) => (value === JSON.parse(token.value)))},
    {"name": "valueCheck", "symbols": [(lexer.has("integer") ? {type: "integer"} : integer)], "postprocess": ([token]) => ((value, instance) => (value === JSON.parse(token.value)))},
    {"name": "valueCheck", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([token]) => ((value, instance) => (value === JSON.parse(token.value)))},
    {"name": "regularExpr", "symbols": [(lexer.has("regexp") ? {type: "regexp"} : regexp)], "postprocess":  ([regExp]) => ((value, instance) => {
            return (new RegExp(regExp.value.slice(1,-1)).test(value.toString()));
        }) },
    {"name": "group", "symbols": [(lexer.has("lp") ? {type: "lp"} : lp), "T", (lexer.has("rp") ? {type: "rp"} : rp)], "postprocess": ([lp, expr, rp]) => expr},
    {"name": "negation", "symbols": [(lexer.has("not") ? {type: "not"} : not), "T"], "postprocess": ([not, typeChecker]) => ((value, instance) => (!typeChecker(value, instance)))},
    {"name": "conjunction", "symbols": ["T", (lexer.has("and") ? {type: "and"} : and), "T"], "postprocess": ([typeChecker1, and, typeChecker2]) => ((value, instance) => (typeChecker1(value, instance) && typeChecker2(value, instance)))},
    {"name": "disjunction", "symbols": ["T", (lexer.has("or") ? {type: "or"} : or), "T"], "postprocess": ([typeChecker1, or, typeChecker2]) => ((value, instance) => (typeChecker1(value, instance) || typeChecker2(value, instance)))},
    {"name": "minus", "symbols": ["T", (lexer.has("sub") ? {type: "sub"} : sub), "T"], "postprocess": ([typeChecker1, sub, typeChecker2]) => ((value, instance) => (typeChecker1(value, instance) && !typeChecker2(value, instance)))},
    {"name": "list", "symbols": [(lexer.has("lsb") ? {type: "lsb"} : lsb), (lexer.has("spread") ? {type: "spread"} : spread), (lexer.has("rsb") ? {type: "rsb"} : rsb)], "postprocess": ([lsb, spread, rsb]) => ((values, instance) => Array.isArray(values))},
    {"name": "list", "symbols": [(lexer.has("lsb") ? {type: "lsb"} : lsb), "listValues", (lexer.has("rsb") ? {type: "rsb"} : rsb)], "postprocess": ([, typeCheckers, ]) => iterationChecker(typeCheckers)},
    {"name": "listValues", "symbols": ["listValues", (lexer.has("separator") ? {type: "separator"} : separator), "listValue"], "postprocess":  ([typeCheckers, , typeChecker]) => {
            return [...typeCheckers, ...typeChecker];
        } },
    {"name": "listValues", "symbols": ["listValue"], "postprocess": ([type]) => type},
    {"name": "listValue", "symbols": [(lexer.has("spread") ? {type: "spread"} : spread), (lexer.has("integer") ? {type: "integer"} : integer), (lexer.has("mult") ? {type: "mult"} : mult), "T"], "postprocess":  ([ , n, , typeChecker]) => {
            // Just append it n times
            return Array(parseInt(n)).fill({
                checker: typeChecker,
                type: "one"
            });
        } },
    {"name": "listValue", "symbols": [(lexer.has("spread") ? {type: "spread"} : spread), "T"], "postprocess":  ([ , typeChecker]) => {
            return [{
                checker: typeChecker,
                type: "zeroPlus"
            }];
        } },
    {"name": "listValue", "symbols": ["T"], "postprocess":  ([typeChecker]) => {
            return [{
                checker: typeChecker,
                type: "one"
            }];
        } },
    {"name": "object", "symbols": [(lexer.has("lb") ? {type: "lb"} : lb), "objectProps", (lexer.has("rb") ? {type: "rb"} : rb)], "postprocess": ([, typeCheckerPairs, ]) => objectChecker(typeCheckerPairs)},
    {"name": "objectProps", "symbols": ["objectProps", (lexer.has("separator") ? {type: "separator"} : separator), "objectProp"], "postprocess":  ([typeCheckerPairs, , typeCheckerPair]) => {
            return [...typeCheckerPairs, ...typeCheckerPair];
        } },
    {"name": "objectProps", "symbols": ["objectProp"], "postprocess": ([prop]) => prop},
    {"name": "objectProp", "symbols": [(lexer.has("spread") ? {type: "spread"} : spread)], "postprocess":  ([]) => {
            return [{
                checkerPair: [],
                type: "spread"
            }];
        } },
    {"name": "objectProp", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), (lexer.has("colon") ? {type: "colon"} : colon), "T"], "postprocess": ([name, , typeChecker]) => objectPropChecker(name, typeChecker, false)},
    {"name": "objectProp", "symbols": [(lexer.has("string") ? {type: "string"} : string), (lexer.has("colon") ? {type: "colon"} : colon), "T"], "postprocess": ([name, , typeChecker]) => objectPropChecker(name, typeChecker, true)},
    {"name": "objectProp", "symbols": ["regularExpr", (lexer.has("colon") ? {type: "colon"} : colon), "T"], "postprocess":  ([typeChecker1, , typeChecker2]) => {
            return [{
                checkerPair: [
                    typeChecker1,
                    typeChecker2
                ],
                type: "oneRegex"
            }];
        } },
    {"name": "objectProp", "symbols": [(lexer.has("spread") ? {type: "spread"} : spread), "regularExpr", (lexer.has("colon") ? {type: "colon"} : colon), "T"], "postprocess":  ([, typeChecker1, , typeChecker2]) => {
            return [{
                checkerPair: [
                    typeChecker1,
                    typeChecker2
                ],
                type: "zeroPlusRegex"
            }];
        } },
    {"name": "objectProp", "symbols": [(lexer.has("spread") ? {type: "spread"} : spread), (lexer.has("integer") ? {type: "integer"} : integer), (lexer.has("mult") ? {type: "mult"} : mult), "regularExpr", (lexer.has("colon") ? {type: "colon"} : colon), "T"], "postprocess":  ([, n, , typeChecker1, , typeChecker2]) => {
            return [{
                checkerPair: [
                    typeChecker1,
                    typeChecker2
                ],
                type: "nRegex",
                count: parseInt(n)
            }];
        } },
    {"name": "customChecker", "symbols": [(lexer.has("pe") ? {type: "pe"} : pe), (lexer.has("integer") ? {type: "integer"} : integer)], "postprocess":  ([ , index]) => {
            return ((values, instance) => {
                const customTypeChecker = instance.checkers[parseInt(index)];
                customTypeChecker || (function() { throw `Invalid custom checker index ${index}` }());
                return customTypeChecker(values);
            });
        } },
    {"name": "classConstructor", "symbols": ["dynamicName"], "postprocess": ([typeChecker]) => typeChecker},
    {"name": "classConstructor", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), (lexer.has("lt") ? {type: "lt"} : lt), "classCheckers", (lexer.has("gt") ? {type: "gt"} : gt)], "postprocess":  ([name, , typeCheckers, ]) => {
            const className = name.value;
            return ((values, instance) => {
                const clazz = instance.getClassChecker()[className]; // [Class, Fun]
                clazz || (function() { throw `Invalid class name "${className}"` }());
                return values instanceof clazz[0] && clazz[1](values, typeCheckers);
            });
        } },
    {"name": "classCheckers", "symbols": ["classChecker"], "postprocess": ([type]) => type},
    {"name": "classCheckers", "symbols": ["classCheckers", (lexer.has("separator") ? {type: "separator"} : separator), "classChecker"], "postprocess":  ([typeCheckers, , typeChecker]) => {
            return [...typeCheckers, ...typeChecker];
        } },
    {"name": "classChecker", "symbols": ["T"], "postprocess": ([typeChecker]) => [typeChecker]},
    {"name": "dynamicName", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess":  ([name]) => {
            const className = name.value;
            return ((value, instance) => {
                const clazz = instance.getClassChecker()[className]; // [Class, Fun]
                clazz || (function() { throw `Invalid class name "${className}"` }());
                return value instanceof clazz[0];
            });
        } }
]
  , ParserStart: "E"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
