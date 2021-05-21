@{%
const moo = require("moo");

const lexer = moo.compile({
    number: /0[xX][0-9a-fA-F]+|(?:\d*(?:\d\.?|\.\d)\d*)(?:[eE][-+]?\d+)?/,
    lp: /\(/,
    rp: /\)/,
    ws: { match: /\s+/, lineBreaks: true },
    opSum: { match: /\+/ },
    opSub: { match: /-/ },
    opMult: { match: /\*/ },
    opIntDiv: { match: /\/\// },
    opDiv: { match: /\// },
    opMod: { match: /%/ },
});

// Hack-ish way to ignora spaces
// props to @Ghabriel: https://github.com/no-context/moo/issues/81#issuecomment-337582515
// TODO: prettify
lexer.next = (next => () => {
    let tok;
    while ((tok = next.call(lexer)) && tok.type === "ws") {}
    return tok;
})(lexer.next);
%}

@lexer lexer

# lower precedence
# a + b
E -> E %opSum T {% ([num1, , num2]) => (num1 + num2) %}
# a - b
E -> E %opSub T {% ([num1, , num2]) => (num1 - num2) %}

# higher precedence
# a * b
T -> T %opMult F {% ([num1, , num2]) => (num1 * num2) %}
# a DIV b -> a // b
T -> T %opIntDiv F {% ([num1, , num2]) => (Math.floor(num1 / num2)) %}
# a / b
T -> T %opDiv F {% ([num1, , num2]) => (num1 / num2) %}
# a MOD b -> a % b
T -> T %opMod F {% ([num1, , num2]) => (num1 % num2) %}

E -> T {% ([expr]) => expr %}
T -> F {% ([expr]) => expr %}

# (e)
T -> %lp E %rp {% ([, num, ]) => Number(num) %}
F -> %lp E %rp {% ([, num, ]) => Number(num) %}
# -(e)
F -> %opSub %lp E %rp {% ([, , num, ]) => (Number(num) * -1) %}
# a
F -> N {% ([num]) => Number(num) %}
# -a
F -> %opSub N {% ([, num]) => (Number(num) * -1) %}

# terminals
N -> %number