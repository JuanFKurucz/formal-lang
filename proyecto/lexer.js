const moo = require("moo");

const lexer = moo.compile({
    number: ["number"],
    xundefined: ["undefined"],
    boolean: ["boolean"],
    string: ["string"],
    xfunction: ["function"],
    object: ["object"],
    symbol: ["symbol"],
    bigint: ["bigint"],
    xvoid: ["void"],
    int: ["int"],
    double: ["double"],
    char: ["char"],
    byte: ["byte"],
    any: ["_", "any"],

    spread: ["..."],

    regexp: /\/.*\//,
    inArray: /in\s*\[.*\]/, // We have to use it like that because we are also matching arrays with %lsb and %rsb

    not: /!/,
    and: /&/,
    or: /\|/,
    sub: /-/,

    lp: /\(/,
    rp: /\)/,

    lsb: /\[/,
    rsb: /\]/,

    ws: { match: /\s+/, lineBreaks: true },
});

// Hack-ish way to ignore spaces
// props to @Ghabriel: https://github.com/no-context/moo/issues/81#issuecomment-337582515
lexer.next = (next => () => {
    let tok;
    while ((tok = next.call(lexer)) && tok.type === "ws") {}
    return tok;
})(lexer.next);

module.exports = lexer;