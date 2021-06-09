const moo = require("moo");

const lexer = moo.compile({
    number: ["number"],
    undefined: ["undefined"],
    boolean: ["boolean"],
    string: ["string"],
    function: ["function"],
    object: ["object"],
    symbol: ["symbol"],
    bigint: ["bigint"],
    // --

    // number: /0[xX][0-9a-fA-F]+|(?:\d*(?:\d\.?|\.\d)\d*)(?:[eE][-+]?\d+)?/,
    // string: /\".*\"/,
    // regexp: /\/.*\//,
    // lp: /\(/,
    // rp: /\)/,
    // lb: /\{/,
    // rb: /\}/,
    // lsb: /\[/,
    // rsb: /\]/,
    // ws: { match: /\s+/, lineBreaks: true },
    // undefined: ["undefined"],
    // boolean: ["true", "false"],
    // null: ["null"],
    // symbol: ["Symbol"],
    // bigint: ["BigInt"],
    // identifier: /[a-zA-Z_\$][\w$]*/,
});

// Hack-ish way to ignore spaces
// props to @Ghabriel: https://github.com/no-context/moo/issues/81#issuecomment-337582515
lexer.next = (next => () => {
    let tok;
    while ((tok = next.call(lexer)) && tok.type === "ws") {}
    return tok;
})(lexer.next);

module.exports = lexer;