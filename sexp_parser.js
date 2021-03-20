const assert = require('assert');

function test(expression, expected) {
    console.log("init test");
    const result = JSON.stringify(parse(expression))
    console.log(result);
    console.log(expected);
    assert.deepStrictEqual(
        result,
        JSON.stringify(expected),
    )
}

function parse(expression) {
    // TODO: maybe a lexical analysis to check
    // whether each "(" has a matching ")",
    // because our parser somewhat assumes they have
    return _parseRegex(expression, 0, expression.length);
};

const _parseRegex = (expression) => {
    let string = expression;
    let list = null;
    let match = null;
    while(match = /(\((?:\(??[^\(]*?\)))/gi.exec(string)){
        const newList = match[0].replace('(','').replace(')','').trim().split(" ")
        if (list){
            newList.push(list)
        }
        list = newList
        string = string.slice(0,match.index)+string.slice(match.index+match[0].length,string.length);
    }
    return list ? list : expression;
}

function _parse(expression, start, end) {
    let arr = [];

    // console.log(`_parse: start ${start}, end ${end}`);
    // console.log(`\texpr: ${expression.slice(start, end + 1)}`);

    let atom = ""; // current atom
    for (let cursor = start; cursor < end; cursor++) {
        const char = expression[cursor];
        switch (char) {
            case "(":
                // Find closing ")" and parse recursively. We're not sending the whole
                // expr but only a portion (which might recursively try to parse again
                // a new portion within it)

                // Try to get closing ")" index
                let closing_index = expression.slice(cursor, end + 1).indexOf(")") // TODO: helper function?
                // console.log(`\tclosing_index ${closing_index}`);

                // If found, parse portion of expr and append to array
                if (closing_index > 0) {
                    closing_index += cursor;
                    arr.push(_parse(expression, cursor + 1, closing_index))
                    cursor = closing_index; // Update cursor so we don't parse the same portion again
                }
                break;
            case " ":
            case "\n":
            case ")":
                // On closing parenthesis or space,
                // add current atom if there's any
                if (atom) {
                    arr.push(atom);
                    atom = "";
                }
                break;
            default:
                // Keep building atom
                atom += char;
        }
    }

    // Add any left atom. E.g. expr "aa" (which
    // is a valid s-exp)
    if (atom) arr.push(atom);

    return arr[0];
}

// export { parse };

test(
    "aa",
    "aa"
)
// test(
//     "(())",
//     [[]]
// );
test(
    "1",
    "1"
);
test(
    "(1)",
    ["1"]
);
test(
    "(- x1 6)",
    ['-', "x1", "6"]
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