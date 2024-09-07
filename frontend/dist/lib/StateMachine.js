"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
class StateMachine {
    constructor(initialState, possibleStates, stateArgs) {
        this.initialState = initialState;
        this.possibleStates = possibleStates;
        this.stateArgs = stateArgs;
        this.state = null;
        for (const state of Object.values(this.possibleStates)) {
            state.stateMachine = this;
        }
    }
    step() {
        if (this.state === null) {
            this.state = this.initialState;
            this.possibleStates[this.initialState].enter(...this.stateArgs);
        }
        this.possibleStates[this.state].execute(...this.stateArgs);
    }
    transition(newState) {
        this.state = newState;
        this.possibleStates[this.state].enter(...this.stateArgs);
    }
}
exports.default = StateMachine;
class State {
    enter(...args) {
    }
    execute(...args) {
    }
}
exports.State = State;
