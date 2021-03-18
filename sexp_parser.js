function parse(expression) {
    // TODO: maybe a lexical analysis to check
    // whether each "(" has a matching ")",
    // because our parser somewhat assumes they have
    return _parse(expression, 0, expression.length);
};

function _parse(expression, start, end) {
    let arr = [];

    console.log(`_parse: start ${start}, end ${end}`);
    console.log(`\texpr: ${expression.slice(start, end + 1)}`);

    let atom = ""; // current atom
    for (let cursor = start; cursor < end; cursor++) {
        const char = expression[cursor];
        switch (char) {
            case " ":
                // New space, add current built atom
                if (atom) {
                    arr.push(atom);
                    atom = "";
                }
                break;
            case "(":
                // Find closing ")" and parse recursively. We're not sending the whole
                // expr but only a portion (which might recursively try to parse again
                // a new portion within it)

                // Try to get closing ")" index
                let closing_index = expression.slice(cursor, end + 1).indexOf(")") // TODO: helper function?
                console.log(`\tclosing_index ${closing_index}`);

                // If found, parse portion of expr and append to array
                if (closing_index > 0) {
                    closing_index += cursor;
                    arr.push(_parse(expression, cursor + 1, closing_index))
                    cursor = closing_index; // Update cursor so we don't parse the same portion again
                }
                break;
            case ")":
                // Closing parenthesis, add
                // current atom if there's any
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

    // console.log(arr);

    // Add any left atom. E.g. "aa" (which is
    // a valida s-exp)
    if (atom) arr.push(atom);

    return arr;
}

// export { parse };

console.log(JSON.stringify(parse("(aa bb (cc dd (pp)) (ff gg))")));
console.log(JSON.stringify(parse("aa")));