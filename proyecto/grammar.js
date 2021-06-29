// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


// TODO: Comentar todos los console logs!!!
// TODO: ver todos los TODOs que hayan por ahí

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
    {"name": "atom", "symbols": [(lexer.has("xnumber") ? {type: "xnumber"} : xnumber)], "postprocess": ([type]) => atomChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("xundefined") ? {type: "xundefined"} : xundefined)], "postprocess": ([type]) => atomChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("boolean") ? {type: "boolean"} : boolean)], "postprocess": ([type]) => atomChecker(type.value)},
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
            return ((value) => values.includes(value));
        } },
    {"name": "values", "symbols": ["values", (lexer.has("separator") ? {type: "separator"} : separator), "value"], "postprocess": ([values, , value]) => { return [...values, ...value]; }},
    {"name": "values", "symbols": ["value"], "postprocess": ([value]) => { return value; }},
    {"name": "value", "symbols": [(lexer.has("booleans") ? {type: "booleans"} : booleans)], "postprocess":  ([token]) => {
            // Note: we're deserializing here on purpose
            // in order to throw an error while parsing
            return [JSON.parse(token.value)];
        } },
    {"name": "valueCheck", "symbols": [(lexer.has("booleans") ? {type: "booleans"} : booleans)], "postprocess": ([token]) => ((value) => (value === JSON.parse(token.value)))},
    {"name": "regularExpr", "symbols": [(lexer.has("regexp") ? {type: "regexp"} : regexp)], "postprocess":  ([regExp]) => ((value) => {
            return (new RegExp(regExp.value.slice(1,-1)).test(value.toString()));
        }) },
    {"name": "group", "symbols": [(lexer.has("lp") ? {type: "lp"} : lp), "T", (lexer.has("rp") ? {type: "rp"} : rp)], "postprocess": ([lp, expr, rp]) => expr},
    {"name": "negation", "symbols": [(lexer.has("not") ? {type: "not"} : not), "T"], "postprocess": ([not, typeChecker]) => ((value) => (!typeChecker(value)))},
    {"name": "conjunction", "symbols": ["T", (lexer.has("and") ? {type: "and"} : and), "T"], "postprocess": ([typeChecker1, and, typeChecker2]) => ((value) => (typeChecker1(value) && typeChecker2(value)))},
    {"name": "disjunction", "symbols": ["T", (lexer.has("or") ? {type: "or"} : or), "T"], "postprocess": ([typeChecker1, or, typeChecker2]) => ((value) => (typeChecker1(value) || typeChecker2(value)))},
    {"name": "minus", "symbols": ["T", (lexer.has("sub") ? {type: "sub"} : sub), "T"], "postprocess": ([typeChecker1, sub, typeChecker2]) => ((value) => (typeChecker1(value) && !typeChecker2(value)))},
    {"name": "list", "symbols": [(lexer.has("lsb") ? {type: "lsb"} : lsb), (lexer.has("spread") ? {type: "spread"} : spread), (lexer.has("rsb") ? {type: "rsb"} : rsb)], "postprocess": ([lsb, spread, rsb]) => ((values) => Array.isArray(values))},
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
    {"name": "objectProp", "symbols": [(lexer.has("property") ? {type: "property"} : property), (lexer.has("colon") ? {type: "colon"} : colon), "T"], "postprocess": ([name, , typeChecker]) => objectPropChecker(name, typeChecker, false)},
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
                count: n
            }];
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
