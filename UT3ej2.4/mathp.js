const nearley = require("nearley");
const grammar = require("./math.js");
const lexer = require('./lexer.js');
const prompt = require('prompt-sync')({ sigint: true });

const argv = require('minimist')(process.argv.slice(2));

// Toggle whether to parse (evaluate)
// or just print all the expression tokens
const tokenize = argv["t"];
const expression = argv["e"];

let parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

if (expression && typeof(expression) !== "boolean") {
    // Evaluate expression and quit
    parser.feed(expression.toString());
    console.log(parser.results[0]);
} else {
    // Prompt the user
    while (true) {
        let expr = prompt('> ');
        parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

        if (tokenize || expr.startsWith(":t ")) {
            // Print tokens
            expr = expr.replace(":t ", "");
            lexer.reset(expr)
            for (const token of lexer) {
                console.log(`${token.type}: ${JSON.stringify(token.text)}`);
            }
        } else {
            // Evaluate
            parser.feed(expr);
            console.log(parser.results[0]);
        }
    }
}