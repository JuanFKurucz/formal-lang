const nearley = require("nearley");
const grammar = require("./math.js");
const assert = require('assert');

// Create new parser before each test
let parser, expr;
beforeEach(function() {
    parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
});

describe('arithmetic', function() {

    expr = '1 + 1';
    it(expr, () => {
        parser.feed(expr);
        assert.equal(parser.results[0], eval(expr));
    });

    expr = '(1 + 1) * 1 / (1 + 3 * 5) - 5';
    it(expr, () => {
        parser.feed(expr);
        assert.equal(parser.results[0], eval(expr));
    });

    expr = '   (1 +   1) * 1 / (1 + 3 *   5   ) - 5    ';
    it(expr, () => {
        parser.feed(expr);
        assert.equal(parser.results[0], eval(expr));
    });

    expr = '5 % 2';
    it(expr, () => {
        parser.feed(expr);
        assert.equal(parser.results[0], eval(expr));
    });

    expr = '5 + (5 // 2)';
    it(expr, () => {
        parser.feed(expr);
        assert.equal(parser.results[0], eval(expr));
    });

    expr = '2 % (5 // 2) + 5 - 3 + 6 + -5*5';
    it(expr, () => {
        parser.feed(expr);
        assert.equal(parser.results[0], eval(expr));
    });

});

describe('logic', function() {

    expr = '1 == 1';
    it(expr, () => {
        parser.feed(expr);
        assert.equal(parser.results[0], eval(expr));
    });

    expr = '1 == 1 != 5';
    it(expr, () => {
        parser.feed(expr);
        assert.equal(parser.results[0], eval(expr));
    });

    expr = '1 >= 1 <= 5 > 5 < 6';
    it(expr, () => {
        parser.feed(expr);
        assert.equal(parser.results[0], eval(expr));
    });

    expr = ' 1 >= (1 <= 5 ) > 5.5 < 6 == (6)';
    it(expr, () => {
        parser.feed(expr);
        assert.equal(parser.results[0], eval(expr));
    });

});

describe('arithmetic + logic', function() {

    expr = '1 - 1 == 1 + 5';
    it(expr, () => {
        parser.feed(expr);
        assert.equal(parser.results[0], eval(expr));
    });

    expr = '1*2 == 1 != 5*6';
    it(expr, () => {
        parser.feed(expr);
        assert.equal(parser.results[0], eval(expr));
    });

    expr = '5 // 1 >= 1 <= 5 > (5 % 2) < 6';
    it(expr, () => {
        parser.feed(expr);
        assert.equal(parser.results[0], eval(expr));
    });

    expr = ' 1 >= (1 + 1 <= 5 ) > -5 < 6 == (6 / 5)';
    it(expr, () => {
        parser.feed(expr);
        assert.equal(parser.results[0], eval(expr));
    });

});