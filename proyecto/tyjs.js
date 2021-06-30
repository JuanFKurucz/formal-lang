const nearley = require("nearley");
const grammar = require("./grammar.js");

class Type {

    /**
     * Default Type constructor
     * @param {string} type a type(s) expression
     * @param {boolean} debug debug mode toggle
     */
    constructor(type, checkers = [], debug = false) {

        this.checkers = checkers;
        this.classCheckers = {};

        // // TODO: borrar
        // this.checkers.push([
        //     [((x, instance) => true)],
        // ]);

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
     * Checks whether a value belongs
     * to this instance's type
     * @param {*} value any value
     */
    checks(value) {
        return this.checker(value, this);
    }

    /**
     * Add new class and its corresponding checker
     * function
     * @param {class} clazz 
     * @param {function} typeChecker 
     */
    classChecker(clazz, typeChecker) {
        this.classCheckers[clazz.name] = [clazz, typeChecker];
    }

    /**
     * Checks whether a value belongs
     * to this instance's type
     * @param {*} value any value
     */
    demand(value) {
        if (this.checks(value)) {
            return value;
        } else {
            throw new TypeError(`Value "${value}" doesn't match type "${this.type}"`);
        }
    }

}

let instance = new Type("Map<number, boolean>", [], true);

instance.classChecker(Array, (values, typeCheckers) => {
    const [typeChecker] = typeCheckers;
    return typeCheckers.length == 1 && values.every((value) => typeChecker(value));
});

instance.classChecker(Set, (values, typeCheckers) => {
    const [typeChecker] = typeCheckers;
    return typeCheckers.length == 1 && Array.from(values).every((value) => typeChecker(value));
});

instance.classChecker(Map, (values, typeCheckers) => {
    if (typeCheckers.length != 2) return false;
    for (const [key, value] of Array.from(values.entries()))
        if (!(typeCheckers[0](key) && typeCheckers[1](value))) return false;
    return true;
});

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Type;
} else {
    window.grammar = Type;
}