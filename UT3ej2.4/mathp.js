const nearley = require("nearley");
const grammar = require("./math.js");
const treeify = require('treeify');
const prompt = require('prompt-sync')({ sigint: true });

const args = process.argv.slice(2);
console.log(args);

while (true) {
    const expr = prompt('> ');
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    parser.feed(expr);
    console.log(parser.results[0]);
}