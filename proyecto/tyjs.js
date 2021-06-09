const nearley = require("nearley");
const grammar = require("./grammar.js");
const lexer = require('./lexer.js');
// const prompt = require('prompt-sync')({ sigint: true });

const argv = require('minimist')(process.argv.slice(2));

class Type {
    // parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    constructor(type) {
        // TODO: check typeof(type) == "string"?
        this.parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        this.parser.feed(type);
        this.ast = this.parser.results[0];
        // {"type": "number", "checker": CHECKERS.get("number")]}
    }

    checks(expr) {
        // Nota: asumimos que en ast guardamos
        // la raíz, la cual tiene una función
        // de entrada que "chequea" todo el árbol
        return this.ast.checker(expr);
    }

}

let numberType = new Type("number");
console.log(numberType.checks("gfgfg"));

// if (expression && typeof(expression) !== "boolean") {
//     // Evaluate expression and quit
//     parser.feed(expression.toString());
//     console.log(parser.results[0]);
// } else {
//     // Prompt the user
//     while (true) {
//         let expr = prompt('> ');
//         parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

//         if (tokenize || expr.startsWith(":t ")) {
//             // Print tokens
//             expr = expr.replace(":t ", "");
//             lexer.reset(expr)
//             for (const token of lexer) {
//                 console.log(`${token.type}: ${JSON.stringify(token.text)}`);
//             }
//         } else {
//             // Evaluate
//             parser.feed(expr);
//             console.log(parser.results[0]);
//         }
//     }
// }