export declare namespace RblxState {
    /** 
        Represent a state which holds the value.
    */
    export interface RblxState<Type> {
      subscribe: (newState: Type) => void;
    }

    /**
     * @Purpose Create a new state.
     */
    export function createRblxState<Type>(state: Type): RblxState<Type>;
}