/*
    Author  : @Mubinet (5220307661)
    Date    : 8/22/2024
*/

/**
 * ### INTERNAL
 * A manager for managing states & updating states.
*/
namespace RblxStateManager {
    export function __createNewState<Type>(state: Type) {
        // Create a new metatable.
        const rblxStateTable = {
            __call: () => {
                print("OKAY");
            }
        }

        return setmetatable(rblxStateTable, {});
    }
}

export = RblxStateManager