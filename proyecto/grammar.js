// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


// TODO: Comentar todos los console logs!!!

const lexer = require("./lexer.js");

const CHECKERS = new Map([
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

const getAtomTypeChecker = type => (CHECKERS.get(type));
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "E", "symbols": ["T"], "postprocess": ([expr]) => expr},
    {"name": "E", "symbols": ["I"], "postprocess": ([expr]) => expr},
    {"name": "T", "symbols": ["atom"], "postprocess": ([x]) => x},
    {"name": "T", "symbols": ["regularExpr"], "postprocess": ([x]) => x},
    {"name": "T", "symbols": ["group"], "postprocess": ([x]) => x},
    {"name": "T", "symbols": ["negation"], "postprocess": ([x]) => x},
    {"name": "T", "symbols": ["conjunction"], "postprocess": ([x]) => x},
    {"name": "T", "symbols": ["disjunction"], "postprocess": ([x]) => x},
    {"name": "T", "symbols": ["minus"], "postprocess": ([x]) => x},
    {"name": "T", "symbols": ["inclusion"], "postprocess": ([x]) => x},
    {"name": "T", "symbols": ["valueCheck"], "postprocess": ([x]) => x},
    {"name": "I", "symbols": ["list"], "postprocess": ([expr]) => expr},
    {"name": "atom", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("xundefined") ? {type: "xundefined"} : xundefined)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("boolean") ? {type: "boolean"} : boolean)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("xfunction") ? {type: "xfunction"} : xfunction)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("object") ? {type: "object"} : object)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("symbol") ? {type: "symbol"} : symbol)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("bigint") ? {type: "bigint"} : bigint)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("xvoid") ? {type: "xvoid"} : xvoid)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("int") ? {type: "int"} : int)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("double") ? {type: "double"} : double)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("char") ? {type: "char"} : char)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("byte") ? {type: "byte"} : byte)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
    {"name": "atom", "symbols": [(lexer.has("any") ? {type: "any"} : any)], "postprocess": ([type]) => getAtomTypeChecker(type.value)},
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
    {"name": "list", "symbols": [(lexer.has("lsb") ? {type: "lsb"} : lsb), "listValues", (lexer.has("rsb") ? {type: "rsb"} : rsb)], "postprocess":  ([, typeCheckers, ]) => {
            return ((values) => {
                let v = 0; // index of current value
                console.log(typeCheckers);
                for (let c = 0; c < typeCheckers.length; c++) {
                    console.log(`value: ${values[v]}`);
                    const currentChecker = typeCheckers[c];     // current checker function
        
                    switch (typeCheckers[c].type) {
                        case "zeroPlus":
                            console.log("zeroPlus...");
                            // Try to check until it finds a mismatch
                            while (currentChecker.checker(values[v])) {
                                v++;
                                if (values[v] === undefined) break;
                            };
                            break;
                        case "one":
                            console.log("one...")
                            if (values[v] === undefined) return false;              // No values left so it's a mismatch
                            if (!currentChecker.checker(values[v])) return false;   // Value doesn't match type
                            v++;
                            break;
                    }
                }
                return values.length == 0 ? true : (v == values.length);
            })
        } },
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
