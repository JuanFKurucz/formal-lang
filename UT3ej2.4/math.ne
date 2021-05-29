@{%
const lexer = require("./lexer.js");

const FUNCTIONS = new Map([
    ['abs', Math.abs],
    ['acos', Math.acos],
    ['acosh', Math.acosh],
    ['asin', Math.asin],
    ['asinh', Math.asinh],
    ['atan', Math.atan],
    ['atanh', Math.atanh],
    ['atan2', Math.atan2],
    ['cbrt', Math.cbrt],
    ['ceil', Math.ceil],
    ['clz32', Math.clz32],
    ['cos', Math.cos],
    ['cosh', Math.cosh],
    ['exp', Math.exp],
    ['expm1', Math.expm1],
    ['floor', Math.floor],
    ['fround', Math.fround],
    ['hypot', Math.hypot],
    ['imul', Math.imul],
    ['log', Math.log],
    ['log1p', Math.log1p],
    ['log10', Math.log10],
    ['log2', Math.log2],
    ['pow', Math.pow],
    ['random', Math.random],
    ['round', Math.round],
    ['sign', Math.sign],
    ['sin', Math.sin],
    ['sinh', Math.sinh],
    ['sqrt', Math.sqrt],
    ['tan', Math.tan],
    ['tanh', Math.tanh],
    ['trunc', Math.trunc],
    ['max', Math.max],
    ['min', Math.min],
]);

%}

@lexer lexer

# arithmetic: a + b
E -> E %opSum T {% ([num1, , num2]) => (num1 + num2) %}
# arithmetic: a - b
E -> E %opSub T {% ([num1, , num2]) => (num1 - num2) %}

# We decided to give those operators the same precedence
# than arithmetic's + and -
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

# functions: name(arg1, arg2, argN)
T -> FN {% ([expr]) => expr %}
FN -> FI %lp A:? %rp {% ([name, , args, ]) => (FUNCTIONS.get(name) || (function(){throw `Undefined function name: ${name}`}())).apply(null, args) %}
# function arguments
A -> E {% ([expr]) => [expr] %}
A -> A %argSeparator E {% ([expr1, , expr2]) => { expr1.push(expr2); return expr1; } %}

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
# !!e (N number of !s)
F -> %opNot E {% ([, num]) => (!(num)) %}
# a
F -> N {% ([num]) => Number(num) %}
# -a
F -> %opSub N {% ([, num]) => (Number(num) * -1) %}

# function: E && fun()
F -> FN {% ([expr]) => expr %}

# boolean: -a
F -> %opSub B {% ([, bool]) => (bool * -1) %}
# boolean: a
F -> B {% ([bool]) => (bool) %}

# terminals
N -> %number
B -> %boolean {% ([bool]) => (bool == "true") %}
FI -> %identifier {% ([name]) => (name.value) %}