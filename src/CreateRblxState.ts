/*
    Author  : @Mubinet (5220307661)
    Date    : 8/22/2024
*/

import { __createNewState } from "./RblxStateManager";

// MODULES


/** 
 * @Purpose Create a new state.
*/
function createRblxState<Type>(state: Type) {
    // Create a new state.
    return __createNewState(state);
}

export = createRblxState