@{%
const lexer = require("./lexer.js");

const FUNCTIONS = new Map([
  ['max', Math.max],
]);

// const max = Math.max.apply(null, numbers);

const callFunc = function(name, args) {
    console.log(`args: ${args}`)
    let fun = FUNCTIONS.get(name.value); // TODO: Por qué no me toma el name.toString()???
    if (fun) {
        console.log(fun);
        return (999);
    } else {
        throw Error(`Undefined function name: ${name.value}`);
    }
};

%}

@lexer lexer

# TODO: doble negación !! para
# TODO: los argumentos del mathp.js (-p y algún otro)

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

# functions: id(...)
# TODO:
# 1- modificar regex para soportar parámetros con coma y espacios
# 2- qué pasa con parámetros literales y "variables"? hacer una regla para mezclar
# literales e "identificadores"
T -> %identifier %lp %rp {% ([name, , ]) => callFunc(name, null) %}
T -> %identifier %lp %arguments %rp {% ([name, , args, ]) => callFunc(name, args) %}
T -> %identifier %lp %identifier %rp {% ([name, , args, ]) => callFunc(name, args) %}

# function parameters
# P -> null
# P -> %identifier
# P -> %identifier "," P

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