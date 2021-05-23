const moo = require("moo");

const lexer = moo.compile({
    number: /0[xX][0-9a-fA-F]+|(?:\d*(?:\d\.?|\.\d)\d*)(?:[eE][-+]?\d+)?/,
    lp: /\(/,
    rp: /\)/,
    ws: { match: /\s+/, lineBreaks: true },
    opSum: { match: /\+/ },
    opSub: { match: /-/ },
    opEq: { match: /==/ },
    opNotEq: { match: /!=/ },
    opLtEq: { match: /<=/ },
    opLt: { match: /</ },
    opGtEq: { match: />=/ },
    opGt: { match: />/ },
    opMult: { match: /\*/ },
    opIntDiv: { match: /\/\// },
    opDiv: { match: /\// },
    opMod: { match: /%/ },
});

// Hack-ish way to ignore spaces
// props to @Ghabriel: https://github.com/no-context/moo/issues/81#issuecomment-337582515
// TODO: prettify
lexer.next = (next => () => {
    let tok;
    while ((tok = next.call(lexer)) && tok.type === "ws") {}
    return tok;
})(lexer.next);

module.exports = lexer;