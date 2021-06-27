const nearley = require("nearley");
const grammar = require("./grammar.js");
const lexer = require('./lexer.js');

class Type {

    /**
     * Default Type constructor
     * @param {string} type a type(s) expression
     * @param {boolean} debug debug mode toggle
     */
    constructor(type, debug = false) {
        typeof(type) === "string" || (function() { throw "type should be a string" }());

        this.parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        try {
            this.parser.feed(type);
        } catch (err) {
            if (debug) {
                // Throw full error stack in debug mode
                throw err;
            } else {
                throw new SyntaxError(`Invalid type "${type}"`);
            }
        }

        // checker is just a function, which is
        // composed by a 1 or more checker functions
        this.checker = this.parser.results[0];
        this.type = type; // to improve output tests
    }

    /**
     * Checkers whether a value belongs
     * to this instance's type
     * @param {*} value any value
     */
    checks(value) {
        return this.checker(value);
    }

}

let instance = new Type("[string, ...boolean, string]");
// console.log(instance.checks(["abc", true, false, true, "abc"]));

// instance = new Type("[string, boolean, string]");
// console.log(instance.checks(["abc", true, "abc"]));

instance = new Type("[...2*[boolean, string]]", true);
console.log(instance.checks([
    [true, "abc"],
    [true, "abc"],
]));

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Type;
} else {
    window.grammar = Type;
}