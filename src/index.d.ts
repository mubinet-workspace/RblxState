/**
 * @Purpose Represents an immutable state

 * ** **
 *
 * Want to access the value of the state? - Call the returned function without passing any argument.
 * 
 * Want to change the value of the state? - Call the returned function with one argument: Either an updater function or the new single variable you want to set to.
 * 
 * Want to listen to the new change of the value in the state? - Use the method of the state ``.subscribe()``.
 */
export interface RblxState<Type> {
  (newState?: Type | ((previousState: Type) => Type)): Type;
  subscribe: (callback: (newState: Type) => void) => () => void | undefined;
}

/**
 * @Purpose Create a new state.
 */
export function createRblxState<Type>(state: Type): RblxState<Type>;

/** 
 * @Purpose Use a React hook to get the latest value from the specified state in the argument.
 * @Info The component from where the hook is used, will re-render upon the value of the state changing.
*/
export function useRblxState<Type>(state: RblxState<Type>): Type;