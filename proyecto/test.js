const assert = require('assert');
const Type = require("./tyjs.js");

const fullTests = true;

const createInstanceType = (type, overridePredifined = [], customCheckers = []) => {
    const instance = new Type(type, customCheckers);
    overridePredifined.forEach(x => {
        instance.classChecker(x[0], x[1]);
    });
    return instance;
}

const evaluate = (instance, cases) => {
    cases.forEach(e => {
        const expected = Array.isArray(e) ? e[1] : true;
        const actual = Array.isArray(e) ? e[0] : e;

        it(`${''+String(actual)} (${typeof actual}) should${(!expected)?"n't":""} be ${instance.type}`, () => {
            assert.strictEqual(instance.checks(actual), expected);
        });
    });
}

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
            evaluate(createInstanceType(this.title), values[this.title]);
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
            evaluate(createInstanceType(`!${type}`), possibleValues);
        });
    }

    describe('number & string', function() {
        const possibleValues = [];
        for (let e in values.any) {
            const element = values.any[e];
            possibleValues.push([Array.isArray(element) ? element[0] : element, false])
        }
        evaluate(createInstanceType(this.title), possibleValues);
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
        evaluate(createInstanceType(this.title), possibleValues);
    });

    if (fullTests) {
        for (let type1 in values) {
            for (let type2 in values) {
                describe(`${type1} | ${type2}`, function() {
                    const possibleValues = [];
                    for (let e in values[type1]) {
                        const element = values[type1][e];
                        if (!Array.isArray(element) || element[1]) {
                            possibleValues.push([Array.isArray(element) ? element[0] : element, true]);
                        }
                    }
                    for (let e in values[type2]) {
                        const element = values[type2][e];
                        if (!Array.isArray(element) || element[1]) {
                            possibleValues.push([Array.isArray(element) ? element[0] : element, true]);
                        }
                    }
                    evaluate(createInstanceType(this.title), possibleValues);
                });
            }
        }
    }
});

describe('values', function() {
    evaluate(
        createInstanceType("boolean & true"), [
            [false, false],
            [true, true],
        ]
    );
    evaluate(
        createInstanceType("true | false"), [
            [false, true],
            [true, true],
        ]
    );
    evaluate(
        createInstanceType("true | false"), [
            [false, true],
            [true, true],
        ]
    );
    evaluate(
        createInstanceType("\"abc\" | boolean"), [
            [false, true],
            [true, true],
            ["def", false],
            ["abc", true],
        ]
    );
    evaluate(
        createInstanceType("1 | boolean"), [
            [false, true],
            [true, true],
            [1, true],
            [2, false],
        ]
    );
    evaluate(
        createInstanceType("1.5 | boolean"), [
            [false, true],
            [true, true],
            [1.5, true],
            [2.5, false],
        ]
    );
    evaluate(
        createInstanceType("NaN"), [
            [NaN, true],
            [1.5, false],
            [2.5, false],
        ]
    );
    evaluate(
        createInstanceType("NaN | boolean"), [
            [NaN, true],
            [5, false],
            [true, true],
        ]
    );
});

describe('inclusions', function() {
    evaluate(
        createInstanceType("boolean & in [true, true, true]"), [
            [false, false],
            [true, true],
        ]
    );
    evaluate(
        createInstanceType("in [false, false, true]"), [
            [false, true],
            [true, true],
        ]
    );
});

describe('iterables', function() {
    evaluate(
        createInstanceType("[...any]"), [
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
        createInstanceType("[...]"), [
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
        createInstanceType("[...boolean]"), [
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
        createInstanceType("[string, ...boolean, string]"), [
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
        createInstanceType("[string, ...2 * boolean, string]"), [
            [
                ["abc", false, false, "abc"], true
            ],
            [
                ["abc", false, false, true, "abc"], false
            ],
        ]
    );
    evaluate(
        createInstanceType("[...3 * boolean]"), [
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
        createInstanceType("[...3 * /[abc]+/]"), [
            [
                ["abc", "abc", "abc"], true
            ],
            [
                ["abc", "abc", "def"], false
            ],
        ]
    );
    evaluate(
        createInstanceType("[...[boolean, string]]"), [
            [
                [
                    [true, "abc"],
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

describe('objects', function() {
    evaluate(
        createInstanceType("{.../a+/: boolean, /b+/: string}"), [
            [{ aaa: true, aaaaa: false, bbb: "abc" }, true],
            [{ bbb: "abc" }, true],
            [{ aaa: true, aaaaa: false, bbb: "abc", c: "abc" }, false],
        ]
    );
    evaluate(
        createInstanceType("{abc: boolean, \"def\": string}"), [
            [{ abc: true, def: "abc" }, true],
            [{ abc: true, "def": "abc" }, true],
            [{ "abc": true, def: "abc" }, true],
            [{ "abc": true, abc: "abc" }, false],
            [{ "abc": true, def: "abc", "xyz": "abc" }, false],
        ]
    );
    evaluate(
        createInstanceType("{abc: boolean, \"def\": string, ...}"), [
            [{ "abc": true, def: "abc", "xyz": "abc" }, true],
        ]
    );
    evaluate(
        createInstanceType("{...2*/a+/: boolean, \"def\": string, ...}"), [
            [{ "aaa": true, "aaaa": true, def: "abc", "xyz": "abc" }, true],
            [{ "aaa": true, "aaaa": true, "aaaaa": true, def: "abc", "xyz": "abc" }, false],
        ]
    );
});

describe('constructs', function() {
    evaluate(
        createInstanceType("Set<boolean>"), [
            [new Set([true, false]), true],
            [new Set([true, "abc"]), false],
            [
                [true, false], false
            ],
            [new Set(), true],
        ]
    );
    evaluate(
        createInstanceType("Set & [...boolean]"), [
            [new Set([true, false]), true],
            [new Set([true, "abc"]), false],
            [
                [true, false], false
            ],
            [new Set(), true],
        ]
    );
    evaluate(
        createInstanceType("Array<boolean>"), [
            [new Array(true, false), true],
            [new Array(true, "abc"), false],
            [
                [true, false], true
            ],
            [new Array(), true],
        ]
    );
    evaluate(
        createInstanceType("Array & [...boolean]"), [
            [new Array(true, false), true],
            [new Array(true, "abc"), false],
            [
                [true, false], true
            ],
            [new Array(), true],
        ]
    );
    evaluate(
        createInstanceType("Map<string, boolean>"), [
            [new Map([
                ["abc", true],
                ["def", false]
            ]), true],
            [new Map([
                ["abc", 1],
                ["def", false]
            ]), false],
            [new Map([]), true],
        ]
    );
    evaluate(
        createInstanceType("Map & [...[string, boolean]]"), [
            [new Map([
                ["abc", true],
                ["def", false]
            ]), true],
            [new Map([
                ["abc", 1],
                ["def", false]
            ]), false],
            [new Map([]), true],
        ]
    );
});

describe('custom', function() {
    evaluate(
        createInstanceType("[$0, $1]", [], [(value => value % 2 == 0), (value => value == 5)]), [
            [
                [2, 5], true
            ],
            [
                [1, 5], false
            ],
            [
                [4, 5], true
            ],
            [
                [4, 3], false
            ],
        ]
    );
    evaluate(
        createInstanceType("[$0, [...$1]]", [], [(value => value % 2 == 0), (value => value == 5)]), [
            [
                [2, [5, 5, 5]], true
            ],
            [
                [2, [5, 4, 5]], false
            ],
            [
                [1, [5, 5, 5]], false
            ],
        ]
    );
});