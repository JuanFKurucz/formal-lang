const nearley = require("nearley");
const grammar = require("./math.js");
const lexer = require('./lexer.js');
const prompt = require('prompt-sync')({ sigint: true });


// 1 - 1 == 1 + 5 debería ser 1 - (1 == 1) + 5
// false
// 1 - (1 == 1) + 5
// 5

// TODO: Cambiar a https://preview.npmjs.com/package/minimist
const args = process.argv.slice(2);

// Toggle whether to parse (evaluate)
// or just print all the expression tokens
const parse = args[0] != '-t';

while (true) {
    const expr = prompt('> ');
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    if (parse) {
        // Evaluate
        parser.feed(expr);
        console.log(parser.results[0]);
    } else {
        // Print tokens
        lexer.reset(expr)
        for (const token of lexer) {
            console.log(`${token.type}: ${JSON.stringify(token.text)}`);
        }
    }
}