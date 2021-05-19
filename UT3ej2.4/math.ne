@{%
const moo = require("moo");

const lexer = moo.compile({
    number: /0[xX][0-9a-fA-F]+|(?:\d*(?:\d\.?|\.\d)\d*)(?:[eE][-+]?\d+)?/,
    lp: /\(/,
    rp: /\)/,
    ws: { match: /\s+/, lineBreaks: true },
    opSum: { match: /\+/ },
    opMult: { match: /\*/ },
    opDiv: { match: /\// },
});

// Hack para evitar espacios
// props to @Ghabriel: https://github.com/no-context/moo/issues/81#issuecomment-337582515
// TODO: dejarlo lindo
lexer.next = (next => () => {
    let tok;
    while ((tok = next.call(lexer)) && tok.type === "ws") {}
    return tok;
})(lexer.next);
%}

@lexer lexer

E -> E %opSum T {% ([num1, , num2]) => (num1 + num2) %}
T -> T %opMult F {% ([num1, , num2]) => (num1 * num2) %}
T -> T %opDiv F {% ([num1, , num2]) => (num1 / num2) %}
E -> T {% ([expr]) => expr %}
T -> F {% ([expr]) => expr %}
T -> %lp E %rp {% ([, num, ]) => Number(num) %}
F -> %lp E %rp {% ([, num, ]) => Number(num) %}
F -> N {% ([num]) => Number(num) %}

# terminales
N -> %number