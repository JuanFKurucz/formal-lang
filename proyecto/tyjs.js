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
        this.ast = this.parser.results[0];
        // console.log(this.ast);
    }

    /**
     * Checkers whether a value belongs
     * to this instance's type
     * @param {*} value any value
     */
    checks(value) {
        // AST is a combination of different
        // "checkers" functions
        return this.ast(value);
    }

}

// TODO: move all those to a node test file
// Note: all those prints should output "true"

let instance = new Type("function");
console.log(instance.checks(x => 1));

instance = new Type("undefined");
console.log(instance.checks(undefined));

instance = new Type("string");
console.log(instance.checks("111"));

instance = new Type("void");
console.log(instance.checks(undefined));
console.log(instance.checks(null));

instance = new Type("int");
console.log(instance.checks(10));
console.log(instance.checks(-10));

instance = new Type("object");
console.log(instance.checks({}));

instance = new Type("double");
console.log(!instance.checks(10));
console.log(instance.checks(10.5));
console.log(instance.checks(NaN));
console.log(instance.checks(Infinity));

instance = new Type("char");
console.log(!instance.checks("111"));
console.log(instance.checks("1"));

instance = new Type("byte");
console.log(!instance.checks(256));
console.log(!instance.checks(-1));
console.log(instance.checks(50));

instance = new Type("any");
console.log(instance.checks(50));
console.log(instance.checks(Infinity));
console.log(instance.checks(null));
console.log(instance.checks("1"));

instance = new Type("_");
console.log(instance.checks(50));
console.log(instance.checks(Infinity));
console.log(instance.checks(null));
console.log(instance.checks("1"));

console.log();

instance = new Type("!byte");
console.log(!instance.checks(50));
console.log(!instance.checks(0));
console.log(instance.checks(undefined));
console.log(instance.checks(-1));

console.log()

instance = new Type("number & !byte", true);
console.log(!instance.checks(50));
console.log(!instance.checks(0));
console.log(!instance.checks(undefined));
console.log(instance.checks(-1));

console.log()

instance = new Type("number | !undefined");
console.log(!instance.checks(undefined));
console.log(instance.checks(50));
console.log(instance.checks(0));
console.log(instance.checks(-1));

console.log()

instance = new Type("string - char");
console.log(!instance.checks("a"));
console.log(instance.checks("aa"));

console.log()

instance = new Type("!(string & (char))");
console.log(!instance.checks("a"));
console.log(instance.checks("aa"));

instance = new Type("any | number");
console.log(instance.checks("a"));
console.log(instance.checks("aa"));
console.log(instance.checks(123));

console.log()

instance = new Type("string & /.{3}/");
console.log(instance.checks("aaa"));
console.log(!instance.checks(123));
console.log(instance.checks("123"));

instance = new Type("number & /.{3}/");
console.log(!instance.checks("aaa"));
console.log(instance.checks(123));
console.log(!instance.checks("123"));

instance = new Type("!/.{3}/");
console.log(!instance.checks("aaa"));
console.log(instance.checks("aa"));

console.log();

instance = new Type("in [\"123\", 5, true]", true);
console.log(instance.checks(5));
console.log(instance.checks("123"));
console.log(instance.checks(true));
console.log(!instance.checks("abc"));

instance = new Type("!in [\"123\", 5, true]");
console.log(!instance.checks(5));
console.log(!instance.checks("123"));
console.log(!instance.checks(true));
console.log(instance.checks("abc"));

instance = new Type("string | in [\"123\", 5, true]");
console.log(instance.checks(5));
console.log(instance.checks("123"));
console.log(instance.checks(true));
console.log(instance.checks("abc"));
console.log(instance.checks("abcd"));

instance = new Type("(string & char) | in [\"123\", 5, true]");
console.log(instance.checks(5));
console.log(instance.checks("123"));
console.log(instance.checks(true));
console.log(!instance.checks("abc"));
console.log(!instance.checks("abcd"));
console.log(instance.checks("a"));

console.log();

try {
    instance = new Type("byte && string");
    console.log(false);
} catch (err) {
    console.log(err.name == "SyntaxError");
}

try {
    instance = new Type("in [\"abc\" 1]");
    console.log(false);
} catch (err) {
    console.log(err.name == "SyntaxError");
}

console.log();

instance = new Type("[...boolean]");
console.log(!instance.checks([false, "abc"]));
console.log(instance.checks([true, false, false]));

instance = new Type("[...(string | boolean)]");
console.log(!instance.checks([false, "abc", 10]));
console.log(instance.checks([false, "abc"]));
console.log(instance.checks([true, false, false]));

instance = new Type("[...(in [10])]", true);
console.log(!instance.checks([false, "abc", 10]));
console.log(instance.checks([false, "abc"]));
console.log(instance.checks([true, false, false]));

instance = new Type("[...]");
console.log(instance.checks([false, "abc"]));
console.log(instance.checks([true, false, false]));

instance = new Type("[...any]");
console.log(instance.checks([false, "abc"]));
console.log(instance.checks([true, false, false]));

// Note: this is an extra, %any = ["any", "_"]
instance = new Type("[..._]");
console.log(instance.checks([false, "abc"]));
console.log(instance.checks([true, false, false]));
// TODO: capture errors on method "checks" or just throw
// the default stack when it can't reduce?
try {
    console.log(instance.checks(true));
    console.log(false);
} catch (err) {
    console.log(err.name == "TypeError");
}