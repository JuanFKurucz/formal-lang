const fs = require('fs');
const moo = require('moo');

/** Run executing `node lex-csv.js < file.csv > tokens.txt`. */
(function main() {
    const lexer = moo.compile({
        comment: /(?:\/\/.*(?:\r?\n)?)|(?:\/\*(?:(?!\*\/).|\r\n|\r|\n)*\*\/)/,
        number: /NaN|[+-]?Infinity|[+-]?0[xX][0-9a-fA-F]+|[+-]?(?:\d*(?:\d\.?|\.\d)\d*)(?:[eE][-+]?\d+)?/,
        boolean: /true|false/,
        string: /"(?:.*?(?:\\\n)?)+"|'(?:.*?(?:\\\n)?)+'/,
        arrayStart: /\[/,
        arrayEnd: /\]/,
        comma: /,/,
        objStart: /\{/,
        objEnd: /\}/,
        pair: /:/,
        null: /null/,
        ws: { match: /\s+/, lineBreaks: true },
        keyword: ['true', 'false', 'null', 'NaN', 'Infinity'],
        identifier: /[a-zA-Z_\$][\w$]*/,
    });

    const input = fs.readFileSync(process.stdin.fd, 'utf-8');

    lexer.reset(input)
    for (const token of lexer) {
        console.log(`${token.type}: ${JSON.stringify(token.text)}`);
    }
})();