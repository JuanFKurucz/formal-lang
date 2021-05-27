/**
 * TODO
 * Arreglar orden de prioridad de operaciones relacionales y operacioens logicas, chequear test case fallando
 * Permitir multiples negaciones
 */

const moo = require("moo");

// TODO: Quitar los match?
const lexer = moo.compile({
    number: /0[xX][0-9a-fA-F]+|(?:\d*(?:\d\.?|\.\d)\d*)(?:[eE][-+]?\d+)?/,
    lp: /\(/,
    rp: /\)/,
    ws: { match: /\s+/, lineBreaks: true },
    boolean: ["true", "false"],
    kwIf: ["if"],
    kwThen: ["then"],
    kwElse: ["else"],
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
    opOr: { match: /\|\|/ },
    opAnd: { match: /&&/ },
    opNot: { match: /!/ }, // TODO: DOBLE NEGADO
    // arguments: /(?:[a-zA-Z_\$]+)(?:,\s*[a-zA-Z_\$]+)*/,
    arguments: /(?:[a-zA-Z_\$]+, ?)+(?:[a-zA-Z_\$]+)?/,
    identifier: /[a-zA-Z_\$][\w$]*/,
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