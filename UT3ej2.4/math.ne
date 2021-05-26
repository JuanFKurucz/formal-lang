@{%
const lexer = require("./lexer.js");

const FUNCTIONS = new Map([
  ['max', Math.max],
]);

// const max = Math.max.apply(null, numbers);

%}

@lexer lexer

# TODO: doble negación !! para

# arithmetic: a + b
E -> E %opSum T {% ([num1, , num2]) => (num1 + num2) %}
# arithmetic: a - b
E -> E %opSub T {% ([num1, , num2]) => (num1 - num2) %}

# TODO: mover a más prioridad
# logic: a == b
E -> E %opEq T {% ([num1, , num2]) => (num1 == num2) %}
# logic: a != b
E -> E %opNotEq T {% ([num1, , num2]) => (num1 != num2) %}
# logic: a <= b
E -> E %opLtEq T {% ([num1, , num2]) => (num1 <= num2) %}
# logic: a < b
E -> E %opLt T {% ([num1, , num2]) => (num1 < num2) %}
# logic: a => b
E -> E %opGtEq T {% ([num1, , num2]) => (num1 >= num2) %}
# logic: a > b
E -> E %opGt T {% ([num1, , num2]) => (num1 > num2) %}

# conditional: if a then b else c
E -> %kwIf E %kwThen E %kwElse E {% ([, cond, , expr1, , expr2]) => (cond ? expr1 : expr2) %}

# TODO: parámetros...
# functions: id(...)
T -> %identifier %lp %rp {% ([name, , ]) => {
    // TODO: Por qué no me toma el name.toString()???
    let fun = FUNCTIONS.get(name.value);
    if (fun) {
        console.log(fun);
        return (999);
    } else {
        throw Error("definime...");
    }
} %}

# arithmetic: a * b
T -> T %opMult F {% ([num1, , num2]) => (num1 * num2) %}
# arithmetic: a // b
T -> T %opIntDiv F {% ([num1, , num2]) => (Math.floor(num1 / num2)) %}
# arithmetic: a / b
T -> T %opDiv F {% ([num1, , num2]) => (num1 / num2) %}
# arithmetic: a % b
T -> T %opMod F {% ([num1, , num2]) => (num1 % num2) %}

# relational: a || b
T -> T %opOr F {% ([num1, , num2]) => (num1 || num2) %}
# relational: a && b
T -> T %opAnd F {% ([num1, , num2]) => (num1 && num2) %}
# relational: !a
T -> %opNot F {% ([, num]) => (!(num)) %}

E -> T {% ([expr]) => expr %}
T -> F {% ([expr]) => expr %}

# (e)
T -> %lp E %rp {% ([, num, ]) => Number(num) %}
F -> %lp E %rp {% ([, num, ]) => Number(num) %}
# -(e)
F -> %opSub %lp E %rp {% ([, , num, ]) => (Number(num) * -1) %}
# !(e)
F -> %opNot %lp E %rp {% ([, , num, ]) => (!(num)) %}
# a
F -> N {% ([num]) => Number(num) %}
# -a
F -> %opSub N {% ([, num]) => (Number(num) * -1) %}

# boolean: -a
F -> %opSub B {% ([, bool]) => (bool * -1) %}
# boolean: a
F -> B {% ([bool]) => (bool) %}

# terminals
N -> %number
# B -> %boolean
B -> %boolean {% ([bool]) => (bool == "true") %}