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

const parser = (expression) => {
    checkValidSexp(expression);
    const result = _parse(expression,0,expression.length)
    return result.operations[0];
};


module.exports = parser