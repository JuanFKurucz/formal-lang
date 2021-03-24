const assert = require('assert');
const { parse } = require("./sexp_parser");

const test = (expression, expected) => {
    try {
        const result = JSON.stringify(parse(expression))
        console.log(`Result: ${result} Expected: ${JSON.stringify(expected)}`)
        assert.deepStrictEqual(
            result,
            JSON.stringify(expected),
        )
    } catch (e) {
        assert.deepStrictEqual(e, expected);
        console.log(`Result: "${e}" Expected: ${JSON.stringify(expected)}`)
    }
}

test(
    "aa",
    "aa"
)
test(
    "(())",
    [[]]
);
test(
    "1",
    "1"
);
test(
    "(1)",
    ["1"]
);

test(
    "(1 2 3 4 5)",
    ["1", "2", "3", "4", "5"]
);
test(
    "((1) 2 (3 (4)) 5)",
    [["1"], "2", ["3", ["4"]], "5"]
);
test(
    "((1) 2 (3 (4 and)) 5)",
    [["1"], "2", ["3", ["4", "and"]], "5"]
);
test(
    "(- x1 6)",
    ['-', "x1", "6"],
    "RECURSIVE"
);
test(
    "(- (x1) 6)",
    ['-', ["x1"], "6"],
    "RECURSIVE"
);
test(
    "(define (fact n))",
    ['define', ["fact", "n"]]
);
test(
    `(define
        (fact n))`,
    ['define', ["fact", "n"]]
);
test(
    `(define
        (fact n))`,
    ['define', ["fact", "n"]]
);
test(
    "(false)", ["false"]
);
test(
    "", ""
);
test(
    "false", "false"
);
test(
    "(ab cd", "Invalid parenthesis", "RECURSIVE"
);
test(
    "(ab cd", "Invalid parenthesis", "RECURSIVE"
);
test(
    "ab cd", "Invalid space not in list", "RECURSIVE"
);
test(
    "ab cd", "Invalid space not in list", "RECURSIVE"
);