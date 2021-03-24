const assert = require('assert');

const test = (expression, expected, testWith = "RECURSIVE") => {
    try {
        const result = JSON.stringify(parse(expression,testWith))
        console.log(`Result: ${result} Expected: ${JSON.stringify(expected)}`)
        assert.deepStrictEqual(
            result,
            JSON.stringify(expected),
        )
    } catch (e) {
        console.log(e)
        assert.deepStrictEqual(e, expected);
        console.log(`Result: "${e}" Expected: ${JSON.stringify(expected)}`)
    }
}

const _insertInside = (parent,current,index=0,value=[]) =>{
    if(!current){
        parent.push(value);
    } else {
        _insertInside(current,current[index],value)
    }
}

const _parse = (expression, start, end) => {
    if(expression === ""){
        return {operations:[""],cursor:0};
    }
    const operations = [];
    let atom = "";
    let cursor=start;
    for (cursor = start; cursor < end; cursor++) {
        const char = expression[cursor];
        switch (char) {
            case "(":
                const result = _parse(expression,cursor+1,end);
                cursor = result.cursor;
                operations.push(result.operations);
                break;
            case ")":
                if(atom){
                    operations.push(atom);
                    atom ="";
                }
                return {operations,cursor};
            case " ":
            case "\n":
                if(atom){
                    operations.push(atom);
                    atom ="";
                }
                break;
            default:
                atom+=char;
        }
    }
    if(atom){
        operations.push(atom);
    }
    return {operations,cursor};
}

const algorithms = {
    "RECURSIVE":_parse,
}

const checkValidSexp = (expression) => {
    let count = 0;
    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];
        if (char === "(") {
            count++;
        } else if (char === ")") {
            count--;
            if (count < 0) break;
        } else if (char === " ") {
            if (count === 0) throw "Invalid space not in list";
        }
    };
    if (count !== 0) throw "Invalid parenthesis";
}

const parse = (expression, algorithm = "RECURSIVE") => {
    checkValidSexp(expression);
    
    if(!Object.keys(algorithms).includes(algorithm)){
        throw `Algorithm ${algorithm} is not in the algorithms list`;
    }

    const result = algorithms[algorithm](expression,0,expression.length)
    return result.operations[0];
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
    "(1 2 3 4 5)",
    ["1", "2", "3", "4", "5"]
);
test(
    "((1) 2 (3 (4)) 5)",
    [["1"], "2", ["3", ["4"]], "5"]
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