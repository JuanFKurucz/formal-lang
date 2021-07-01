const moo = require("moo");

const lexer = moo.compile({
    xnumber: ["number"],
    xundefined: ["undefined"],
    xboolean: ["boolean"],
    xstring: ["string"],
    xfunction: ["function"],
    object: ["object"],
    symbol: ["symbol"],
    bigint: ["bigint"],
    xvoid: ["void"],
    uint32: ["uint32"],
    int32: ["int32"],
    uint16: ["uint16"],
    int16: ["int16"],
    uint8: ["uint8"],
    int8: ["int8"],
    int: ["int"],
    double: ["double"],
    char: ["char"],
    byte: ["byte"],
    any: ["_", "any"],
    spread: ["..."],
    regexp: /\/(?:[^\n\\\/]|\\[^\n])+\//,
    xin: ["in"],
    boolean: ["true", "false"],
    separator: /,/,
    not: /!/,
    and: /&/,
    or: /\|/,
    sub: /-/,
    mult: /\*/,
    lp: /\(/,
    rp: /\)/,
    lsb: /\[/,
    rsb: /\]/,
    lb: /{/,
    rb: /}/,
    lt: /</,
    gt: />/,
    colon: /:/,
    pe: /\$/,
    number: /NaN|[+-]?Infinity|[+-]?0[xX][0-9a-fA-F]+|[+-]?(?:\d*(?:\d\.?|\.\d)\d*)(?:[eE][-+]?\d+)?/,
    string: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/,
    identifier: /[a-zA-Z_\$][\w$]*/,
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