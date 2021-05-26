const nearley = require("nearley");
const grammar = require("./math.js");
const assert = require('assert');

// Create new parser before each test
let parser, expr;
beforeEach(function() {
    parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
});

const evaluate = expr => {
    expr.forEach(e => {
        it(e, () => {
            parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
            parser.feed(e);
            assert.equal(parser.results[0], eval(e));
        });
    });
}

describe('arithmetic', function() {
    expr = ['1 + 1',
        '(1 + 1) * 1 / (1 + 3 * 5) - 5',
        '   (1 +   1) * 1 / (1 + 3 *   5   ) - 5    ',
        '5 % 2',
        '5 + (5 // 2)',
        '2 % (5 // 2) + 5 - 3 + 6 + -5*5'
    ];
    evaluate(expr);
});

describe('logic', function() {
    expr = [
        '1 == 1',
        '1 == 1 != 5',
        '1 >= 1 <= 5 > 5 < 6',
        ' 1 >= (1 <= 5 ) > 5.5 < 6 == (6)',
    ];
    evaluate(expr);
});

describe('arithmetic + logic', function() {
    expr = [
        '1 - 1 == 1 + 5',
        '1*2 == 1 != 5*6',
        '5 // 1 >= 1 <= 5 > (5 % 2) < 6',
        ' 1 >= (1 + 1 <= 5 ) > -5 < 6 == (6 / 5)',
    ];
    evaluate(expr);
});

describe('relational', function() {

    // sin identificadores
    expr = [
        '(1 || 0) && 1',
        '1 && (1 || 0 || 4) && 0',

    ];
    evaluate(expr);
});