const nearley = require("nearley");
const grammar = require("./grammar.js");
const lexer = require('./lexer.js');
// const prompt = require('prompt-sync')({ sigint: true });

const argv = require('minimist')(process.argv.slice(2));

class Type {

    constructor(type) {
        typeof(type) === "string" || (function() { throw "type should be a string" }());

        this.parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        this.parser.feed(type);
        this.ast = this.parser.results[0];
    }

    checks(expr) {
        // Nota: asumimos que en ast guardamos
        // la raíz, la cual tiene una función
        // de entrada que "chequea" todo el árbol
        return this.ast.checker(expr);
    }

}

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

instance = new Type("double");
// console.log(instance.checks(10));
console.log(instance.checks(10.5));
console.log(instance.checks(NaN));
console.log(instance.checks(Infinity));

instance = new Type("char");
// console.log(instance.checks("111"));
console.log(instance.checks("1"));

instance = new Type("byte");
// console.log(instance.checks(256));
// console.log(instance.checks(-1));
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