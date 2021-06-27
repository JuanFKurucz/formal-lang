const nearley = require("nearley");
const grammar = require("./grammar.js");
const assert = require('assert');
const Type = require("./tyjs.js");

let parser, expr;

const evaluate = (instance, cases) => {
    cases.forEach(e => {
        const expected = Array.isArray(e) ? e[1] : true;
        const actual = Array.isArray(e) ? e[0] : e;

        it(`${''+String(actual)} (${typeof actual}) should${(!expected)?"n't":""} be ${instance.type}`, () => {
            assert.strictEqual(instance.checks(actual), expected);
        });
    });
}

/*
 ["number", value => typeof(value) === "number"],
    ["undefined", value => typeof(value) === "undefined"],
    ["boolean", value => typeof(value) === "boolean"],
    ["string", value => typeof(value) === "string"],
    ["function", value => typeof(value) === "function"],
    ["object", value => typeof(value) === "object"],
    ["symbol", value => typeof(value) === "symbol"],
    ["bigint", value => typeof(value) === "bigint"],
    ["void", value => (value === null || typeof(value) === "undefined")], // typeof(null) = 'object' instead of 'null'
    ["int", value => (typeof(value) === "number" && Number.isInteger(value))],
    ["double", value => (typeof(value) === "number" && !Number.isInteger(value))],
    ["char", value => (typeof(value) === "string" && value.length === 1)],
    ["byte", value => (typeof(value) === "number" && value >= 0 && value <= 255 && parseInt(value) === value)],
    ["_", value => true],
    ["any", value => true],
*/

const values = {
    "number": [],
    "undefined": [undefined],
    "boolean": [true, false],
    "string": ["ads", "", "1", [1, false]],
    "function": [x => 1, () => {}, (x, y, w) => x * y * w],
    "object": [{}],
    "symbol": [Symbol("foo"), Symbol("")],
    "bigint": [BigInt("1")],
    "void": [undefined, null],
    "int": [10, -10, [10.5, false]],
    "double": [
        [10, false],
        10.5,
        NaN,
        Infinity, ["asd", false],
        ["a", false],
    ],
    "char": [
        ["asd", false],
        "a", ["", false],
        " ", [1, false],
        [10.5, false]
    ],
    "byte": [
        [-1, false],
        0,
        255, [256, false],
        [10.5, false]
    ],
    "any": [],
    "_": []
}

//create number
for (let key in values) {
    if (key === "number") {
        continue;
    }
    if (["int", "double", "byte"].indexOf(key) !== -1) {
        for (let e in values[key]) {
            const element = values[key][e];
            if (!Array.isArray(element) || element[1]) {
                values["number"].push([Array.isArray(element) ? element[0] : element, true])
            }
        }
    } else {
        for (let e in values[key]) {
            const element = values[key][e];
            if (!Array.isArray(element) || element[1]) {
                values["number"].push([Array.isArray(element) ? element[0] : element, false])
            }
        }
    }
}

//create any and _
for (let key in values) {
    for (let e in values[key]) {
        const element = values[key][e];
        values["any"].push([Array.isArray(element) ? element[0] : element, true])
        values["_"].push([Array.isArray(element) ? element[0] : element, true])
    }
}

describe('atoms', function() {
    for (let type in values) {
        describe(type, function() {
            evaluate(new Type(this.title), values[this.title]);
        });
    }
});

describe('combination', function() {
    for (let type in values) {
        describe(`!${type}`, function() {
            const possibleValues = [];
            for (let e in values[type]) {
                const element = values[type][e];
                possibleValues.push(Array.isArray(element) ? [element[0], !element[1]] : [element, false])
            }
            evaluate(new Type(`!${type}`), possibleValues);
        });
    }

    describe('number & string', function() {
        const possibleValues = [];
        for (let e in values.any) {
            const element = values.any[e];
            possibleValues.push([Array.isArray(element) ? element[0] : element, false])
        }
        evaluate(new Type(this.title), possibleValues);
    });
    describe('number | string', function() {
        const possibleValues = [];
        for (let e in values.any) {
            const element = values.any[e];
            for (let e in values.number) {
                const element = values.number[e];
                if (!Array.isArray(element) || element[1]) {
                    possibleValues.push([Array.isArray(element) ? element[0] : element, true]);
                }
            }
            for (let e in values.string) {
                const element = values.string[e];
                if (!Array.isArray(element) || element[1]) {
                    possibleValues.push([Array.isArray(element) ? element[0] : element, true]);
                }
            }
        }
        evaluate(new Type(this.title), possibleValues);
    });

    // for (let type1 in values) {
    //     for (let type2 in values) {
    //         describe(`${type1} | ${type2}`, function() {
    //             const possibleValues = [];
    //             for (let e in values[type1]) {
    //                 const element = values[type1][e];
    //                 if (!Array.isArray(element) || element[1]) {
    //                     possibleValues.push([Array.isArray(element) ? element[0] : element, true]);
    //                 }
    //             }
    //             for (let e in values[type2]) {
    //                 const element = values[type2][e];
    //                 if (!Array.isArray(element) || element[1]) {
    //                     possibleValues.push([Array.isArray(element) ? element[0] : element, true]);
    //                 }
    //             }
    //             evaluate(new Type(this.title), possibleValues);
    //         });
    //     }
    // }
});

// TODO: tests para regex y algunos combinaciones

describe('values', function() {
    evaluate(
        new Type("boolean & true"), [
            [false, false],
            [true, true],
        ]
    );
    evaluate(
        new Type("true | false"), [
            [false, true],
            [true, true],
        ]
    );
    // TODO: tests para strings y numbers
});

describe('inclusions', function() {
    evaluate(
        new Type("boolean & in [true, true, true]"), [
            [false, false],
            [true, true],
        ]
    );
    evaluate(
        new Type("in [false, false, true]"), [
            [false, true],
            [true, true],
        ]
    );
    // TODO: tests para strings y numbers
});

describe('iterables', function() {
    evaluate(
        new Type("[...any]"), [
            [
                [false], true
            ],
            [
                ["aaa", true], true
            ],
            [
                [], true
            ]
        ]
    );
    evaluate(
        new Type("[...]"), [
            [
                [false], true
            ],
            [
                ["aaa", true], true
            ],
            [
                [], true
            ]
        ]
    );
    evaluate(
        new Type("[...boolean]"), [
            [
                [false, false, true], true
            ],
            [
                [], true
            ],
            [
                ["abc", true], false
            ],
            [
                [true, "abc"], false
            ],
        ]
    );
    evaluate(
        new Type("[string, ...boolean, string]"), [
            [
                ["abc", false, false, true, "abc"], true
            ],
            [
                ["abc", "abc"], true
            ],
            [
                ["abc", true, "abc"], true
            ],
            [
                ["abc", true, false], false
            ],
            [
                ["abc"], false
            ],
        ]
    );
    evaluate(
        new Type("[string, ...2 * boolean, string]"), [
            [
                ["abc", false, false, "abc"], true
            ],
            [
                ["abc", false, false, true, "abc"], false
            ],
        ]
    );
    evaluate(
        new Type("[...3 * boolean]"), [
            [
                ["abc", false, false, true], false
            ],
            [
                [false, false, true], true
            ],
            [
                [false, false, true, "abc"], false
            ],
            [
                [false, false], false
            ],
        ]
    );
    evaluate(
        new Type("[...3 * /[abc]+/]"), [
            [
                ["abc", "abc", "abc"], true
            ],
            [
                ["abc", "abc", "def"], false
            ],
        ]
    );
    evaluate(
        new Type("[...[boolean, string]]"), [
            [
                [
                    [true, "abc"]
                ], true
            ],
            [
                [
                    [true, "abc"],
                    [true, "abc"]
                ], true
            ],
            [
                [
                    [true, "abc"],
                    [true, "abc"],
                    ["abc", true]
                ], false
            ],
        ]
    );
});