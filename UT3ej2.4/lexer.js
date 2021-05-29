const moo = require("moo");

const lexer = moo.compile({
    number: /0[xX][0-9a-fA-F]+|(?:\d*(?:\d\.?|\.\d)\d*)(?:[eE][-+]?\d+)?/,
    lp: /\(/,
    rp: /\)/,
    ws: { match: /\s+/, lineBreaks: true },
    boolean: ["true", "false"],
    kwIf: ["if"],
    kwThen: ["then"],
    kwElse: ["else"],
    opSum: /\+/,
    opSub: /-/,
    opEq: /==/,
    opNotEq: /!=/,
    opLtEq: /<=/,
    opLt: /</,
    opGtEq: />=/,
    opGt: />/,
    opMult: /\*/,
    opIntDiv: /\/\//,
    opDiv: /\//,
    opMod: /%/,
    opOr: /\|\|/,
    opAnd: /&&/,
    opNot: /!/,
    identifier: /[a-zA-Z_\$][\w$]*/,
    argSeparator: /,/,
});

// Hack-ish way to ignore spaces
// props to @Ghabriel: https://github.com/no-context/moo/issues/81#issuecomment-337582515
lexer.next = (next => () => {
    let tok;
    while ((tok = next.call(lexer)) && tok.type === "ws") {}
    return tok;
})(lexer.next);

module.exports = lexer;