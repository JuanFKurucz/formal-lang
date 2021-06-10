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

let numberType = new Type("number");
console.log(numberType.checks(1));

let stringTypeWrong = new Type("string");
console.log(stringTypeWrong.checks(111));

let stringTypeGood = new Type("string");
console.log(stringTypeGood.checks("111"));