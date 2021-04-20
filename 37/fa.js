/** Class for representing Finite Automata.
 * 
 */
export class FiniteAutomaton {
    /** Take a list of transitions like `[s0, sym, s1]` and crates a nested `Map`.
     */
    static makeTransitions(it) {
        return [...it].reduce((acc, [s0, sym, s1]) => {
            let s0Trans = acc.get(s0);
            if (!s0Trans) {
                s0Trans = new Map();
                acc.set(s0, s0Trans);
            }
            let s0SymStates = s0Trans.get(sym);
            if (!s0SymStates) {
                s0SymStates = new Set();
                s0Trans.set(sym, s0SymStates);
            }
            s0SymStates.add(s1);
            return acc;
        }, new Map());
    }

    /** Takes a `start` state, a list of `finals` and a list of `transitions`.
     * 
     * @param {int} [args.start=0]
     * @param {Array<int>} [args.finals=[]]
     * @param {Array<Array>} [args.transitions=[]]
     */
    constructor(args) {
        const {
            start = 0,
                finals = [],
                transitions = [],
        } = args || {};
        Object.defineProperties(this, {
            start: { value: start },
            finals: { value: new Set([...finals]) },
            transitions: { value: this.constructor.makeTransitions(transitions) },
        });
    }

    /** Determines if the given `state` is final.
     *
     * @param {int} [state]
     * @returns {boolean}
     */
    isFinal(state) {
        return this.finals.has(state);
    }

    /** An array with the states directly reachable from the given `state` with
     * the given `symbol`. Epsilon transitions use `''` as symbol.
     *
     * @param {int} [state]
     * @param {string} [symbol='']
     * @returns {Array<string>}
     */
    canGoTo(state, symbol = '') {
        const stateTrans = this.transitions.get(state);
        return [...(stateTrans && stateTrans.get(symbol)) || []];
    }

    /** A `Set` with all the states reachable from the given `from` state. If the
     * `withSymbols` set of symbols is given, only transitions with those symbols
     * will be considered.
     * 
     * @param {int} [from=this.start]
     * @param {Set<string>} [withSymbols=null]
     * @returns {Set<int>}
     */
    closure(from, withSymbols) {
        from = typeof from === 'undefined' ? this.start : from;
        withSymbols = withSymbols ? new Set([...withSymbols]) : null;
        const pending = [from];
        const result = new Set();
        while (pending.length > 0) {
            const state = pending.pop();
            result.add(state);
            const stateTrans = this.transitions.get(state);
            if (stateTrans) {
                for (const [symbol, target] of stateTrans.entries()) {
                    if (!withSymbols || withSymbols.has(symbol)) {
                        pending.push(...[...target].filter(x => !result.has(x)));
                    }
                }
            }
        }
        return result;
    }

    /** The `Set` of all states in this automaton, reachable from the start state.
     * 
     * @returns {Set<int>}
     */
    states() {
        return this.closure(this.start);
    }

    /** A `Set` with all the symbols used by this automaton `start` state by
     * default.
     * 
     * @returns {Set<int>}
     */
    alphabet() {
        const result = new Set();
        for (const trans of this.transitions.values()) {
            for (const symbol of trans.keys()) {
                result.add(symbol);
            }
        }
        return result;
    }

    /** Enumerates all possible paths for the given `input` in this automaton,
     * from the given `from` state (or `start` by default).
     * 
     * @param {string} input 
     * @param {int} [from=this.start]
     * @yields {Array<>}
     */
    *
    paths(input, from) {
        from = typeof from === 'undefined' ? this.start : from;
        const self = this;

        function* pathRecursive(inputIndex, currentPath) {
            if (inputIndex < input.length) {
                const symbol = input[inputIndex];
                const currentState = currentPath[currentPath.length - 1];
                for (const target of self.canGoTo(currentState, symbol)) {
                    yield* pathRecursive(inputIndex + 1, currentPath.concat([target]));
                }
            } else {
                yield currentPath;
            }
        }
        yield* pathRecursive(0, [from]);
    }

    /** Decides if the given `input` is accepted by this automaton.
     * 
     * @param {string} input 
     * @param {int} [from=this.start]
     * @returns {boolean}
     */
    parse(input, from) {
        for (const path of this.paths(input, from)) {
            const lastState = path[path.length - 1];
            if (this.isFinal(lastState)) {
                return true;
            }
        }
        return false;
    }

    clone() {
        const start = this.start;
        const finals = [...this.finals];
        const transitions = [];
        for (const [s0, symbols] of this.transitions.entries()) {
            for (const [symbol, s1s] of symbols.entries()) {
                for (const s1 of s1s) {
                    transitions.push([s0, symbol, s1]);
                }
            }
        }
        console.log(start,finals,transitions)
        return new this.constructor({ start, finals, transitions });
    }

    /** Decides whether this automaton is complete or not. 
     * 
     * @returns {boolean}
     */
    isComplete() {
        const symbols = this.alphabet();
        const states = this.states();
        return [...states].every(state =>
            this.transitions.has(state) && this.transitions.get(state).size == symbols.size
        );
    }

    getUniqueStateId(){
        const string = Math.random().toString(36).substr(2, 14)+Math.random().toString(36).substr(2, 14);
        return string.split('').map(c => Math.random()>0.5 ? c.toUpperCase() : c.toLowerCase()).join('');
    }

    /** Makes a new `FiniteAutomaton`, equivalent to this one, but complete. 
     * 
     * @returns {FiniteAutomaton}
     */
    complete() {
        const symbols = this.alphabet();
        const states = this.states();
        let endState = `end_${this.getUniqueStateId()}`;
        while(states.has(endState)){
            endState = `end_${this.getUniqueStateId()}`;
        }
        const transitions = [];
        [...states, endState].map(state => {
            symbols.forEach(symbol => {
                const currentTransitions = this.transitions.has(state) && this.transitions.get(state).get(symbol);
                if (currentTransitions) {
                    [...currentTransitions].forEach(target => {
                        transitions.push([state, symbol, target]);
                    });
                } else {
                    transitions.push([state, symbol, endState]);
                }
            });
        });
        return new FiniteAutomaton({ start: this.start, finals: this.finals, transitions })
    }

    /** Decides whether this automaton has epsilon transitions or not.
     * 
     * @returns {boolean}
     */
    hasEpsilonTransitions() {
        for (const trans of this.transitions.values()) {
            if (trans.has('')) {
                return true;
            }
        }
        return false;
    }

    /** Decides whether this automaton is deterministic or not, i.e. if there is
     * at most one transition from every state with every symbol.
     * 
     * @returns {boolean}
     */
    isDeterministic() {
        for (const trans of this.transitions.values()) {
            for (const target of trans.values()) {
                if (target.length > 1) {
                    return false;
                }
            }
        }
        return true;
    }

    /** Makes a new `FiniteAutomaton`, equivalent to this one, but deterministic. 
     * 
     * @returns {FiniteAutomaton}
     */
    dfa() {
        const newStart = 'inicio';
        const unvisitedNewStates = new Set([newStart]);
        const visitedNewStates = new Set();
        const newFinals = new Set();
        const newTransitions = new Set();
        const statesMap = {};
        statesMap[newStart] = [this.start];
        
        while (unvisitedNewStates.size > 0) {
            for (const newState of unvisitedNewStates) {
                unvisitedNewStates.delete(newState);
                visitedNewStates.add(newState);

                const newStateTransitions = {};
                for (let i=0; i < statesMap[newState].length; i++) {
                    const state = statesMap[newState][i];
                    if (this.isFinal(state)) newFinals.add(newState);
                    const transitions = this.transitions.get(state);
                    if (transitions) {
                        for (const symbol of transitions.keys()) {
                            for (const target of transitions.get(symbol)) {
                                if (Object.keys(newStateTransitions).indexOf(symbol) >= 0) {
                                    newStateTransitions[symbol].push(target);
                                } else {
                                    newStateTransitions[symbol] = [target];
                                }
                            }
                        }
                        for (let i=0; i < Object.keys(newStateTransitions).length; i++) {
                            const symbol = Object.keys(newStateTransitions)[i];
                            const newTarget = newStateTransitions[symbol].join();
                            if (Object.keys(statesMap).indexOf(newTarget) < 0) {
                                statesMap[newTarget] = newStateTransitions[symbol];
                            }
                            newTransitions.add([newState, symbol, newTarget]);
                            if (!visitedNewStates.has(newTarget)) {
                                unvisitedNewStates.add(newTarget);
                            }
                        }
                    }
                }
            }
        }

        return new FiniteAutomaton({ start: newStart, finals: [...newFinals], transitions: [...newTransitions] })
    }
} // class FiniteAutomaton