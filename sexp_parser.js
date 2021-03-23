const assert = require('assert');
const testWith = "REGEXP";

const test = (expression, expected) => {
    const result = JSON.stringify(parse(expression,testWith))
    console.log(`Result: ${result} Expected: ${JSON.stringify(expected)}`)
    assert.deepStrictEqual(
        result,
        JSON.stringify(expected),
    )
}

const _insertInside = (parent,current,index=0,value=[]) =>{
    if(!current){
        parent.push(value);
    } else {
        _insertInside(current,current[index],value)
    }
}

const _parseRegexp = (expression) => {
    let string = expression;
    let list = null;
    let match = null;
    while(match = /\(\(??([^\(]*?)\)/g.exec(string)){
        let newList = [];
        if (!match[1]){
            const tmpList = match.input.split("(").filter(x => !x);
            console.log(tmpList)
            for(let i=1;i<tmpList.length;i++){
                _insertInside(newList,newList[0]);
            }
            list = newList
            break;
        } else {
            newList = match[1].trim().split(" ");
            if (list){
                newList.push(list)
            }
        }
        list = newList
        string = string.slice(0,match.index)+string.slice(match.index+match[0].length,string.length);
    }
    return list ? list : expression;
}

const _parse = (expression, start, end) => {
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

    return arr;
}

const algorithms = {
    "RECURSIVE":_parse,
    "REGEXP":_parseRegexp
}

const parse = (expression, algorithm = "RECURSIVE") => {
    // TODO: maybe a lexical analysis to check
    // whether each "(" has a matching ")",
    // because our parser somewhat assumes they have
    if(!Object.keys(algorithms).includes(algorithm)){
        throw `Algorithm ${algorithm} is not in the algorithms list`;
    }

    const result = algorithms[algorithm](expression,0,expression.length)
    if (algorithm === "RECURSIVE"){
        return result[0];
    }
    return result;
};


// export { parse };

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