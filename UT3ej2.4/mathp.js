const nearley = require("nearley");
const grammar = require("./math.js");
const treeify = require('treeify');
// const prettyjson = require('prettyjson');

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

// casos felices
parser.feed("2 > (1+1)");
// parser.feed("14*4+5+4");
// parser.feed("(5+4)*5*(5/5+2)*2");
// console.log();
// parser.feed("(5*5+(2))*2");

console.log(parser.results[0]);
// console.log(parser.results);
// console.log(
//     treeify.asTree(parser.results[0], true)
// );

// console.log(prettyjson.render(parser.results))

// for (token of parser.results[0]) {
//     console.log(token);
// }