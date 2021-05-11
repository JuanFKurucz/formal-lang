import { FiniteAutomaton } from './fa.js';

const fa = new FiniteAutomaton({
    start: 0,
    finals: [1],
    transitions: [
        [0, "a", 1],
        [0, "a", 2],
        [0, "c", 1],
        [1, "a", 2],
        [1, "b", 2],
    ]
});

console.log(fa.parse("") == false);
console.log(fa.parse("a") == true);
console.log(fa.parse("aa") == false);

console.log(fa.states()); // {0, 1}


console.log(fa.isFinal(0) == false);
console.log(fa.isFinal(1) == true);


console.log(fa.alphabet()); // {a}
console.log(fa.hasEpsilonTransitions() == false);
console.log(fa.isDeterministic() == true);
console.log(fa.isComplete() == true);

console.log('----------')
const completed = fa.complete();
console.log(completed.isComplete());
console.log(completed.states());
console.log(completed.finals);
console.log(completed.transitions);

console.log('----------')
const deterministic = fa.dfa();
console.log(deterministic.transitions);
console.log(deterministic.isDeterministic());
console.log(deterministic.finals);
