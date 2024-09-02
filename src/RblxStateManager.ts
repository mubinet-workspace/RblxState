/*
    Author  : @Mubinet (5220307661)
    Date    : 8/22/2024
*/

// SERVICES
import { HttpService } from "@rbxts/services";

// MODULES
import { RblxState } from ".";

/**
 * ### INTERNAL
 * A manager for managing states & updating states.
*/
namespace RblxStateManager {
	interface InternalState<Type> {
		_stateUUID: string,
		_internalState: RblxState<Type>,
		_storage: Type
	}

	interface InternalSubscriber<Type> {
		_subscriberCallback: (newState: Type) => void,
		_state: InternalState<Type>
	}

    /**
     * A list of internal states to be managed.
    */
    const _states: InternalState<any>[] = new Array();

	/** 
	 * A list of subscribers for states.
	*/
	const _subscribers: InternalSubscriber<any>[] = new Array();

    /** 
     * Internal utility function to create a new managed state.
    */
   function _createNewInternalState<Type>(stateUUID: string, rblxState: RblxState<Type>, initalState?: Type) {
		// Create an internal state.
		const internalState = {
			_stateUUID: stateUUID,
			_internalState: rblxState,
			_storage: initalState
		};

		_states.push(internalState);
   }
   
   function _notifySubscribers<Type>(stateUUID: string, newState: Type) {
		for (const _subscriber of _subscribers) {
       		if (_subscriber._state._stateUUID === stateUUID) {
         		// Invoke the callback with the new state value.
         		_subscriber._subscriberCallback(newState);
       		}
     	}
   }

   function _updateInternalState<Type>(internalState: InternalState<Type>, newValue: Type) {
		// Update the value.
		internalState._storage = newValue;
		
		// Notify the subscribers of that state.
		_notifySubscribers(internalState._stateUUID, newValue);
   }

   function _getInternalStateByUUID<Type>(UUID: string) : InternalState<Type> | undefined {
		// Find the state based on the UUID.
		for (const state of _states) {
			if (state._stateUUID === UUID) {
				return state;
			}
		}

		return undefined;
   }

   // STATE CLASS IMPLEMENTATIONS
   //-----------------------------------//

   function _implementStateGetterOrSetter<Type>(stateUUID: string, newState?: Type | ((previousState: Type) => Type)) {
		const internalState = _getInternalStateByUUID<Type>(stateUUID);

		if (internalState) {
			// Getter
			if (!newState) return internalState._storage;

			// Setter
			if (typeOf(newState) === "function") {
                // Invoke and set the returned result.
                const _newStateSetter = newState as ( previousState: Type ) => Type | undefined;
                const result = _newStateSetter(internalState._storage);

                if (result) {
                  // Update the value of the internal state.
                  _updateInternalState(internalState, result);

                  // Return the updated value.
                  return internalState._storage;
                }
			} else if (!typeIs(newState, "function")) {
				// Update the value of the internal state.
				_updateInternalState(internalState, newState);

				// Return the updated value.
				return internalState._storage;
			}
		}
   }

   function _implementSubscribeFunction<Type>(stateUUID: string, callback: (newState: Type) => void) {
		// Get the state metatable.
		const internalState = _getInternalStateByUUID<Type>(stateUUID);

		if (internalState) {
			// Create a new internal subscriber.
			const _subscriber : InternalSubscriber<Type> = {
				_subscriberCallback: callback,
				_state: internalState
			}

			_subscribers.push(_subscriber);
		}
   }

   //-----------------------------------//

    export function __createNewState<Type>(state?: Type) {
		// Create an UUID for a state.
		const _stateUUID = HttpService.GenerateGUID(false);

        // Create a new functional state
        const rblxStateFunctionalTable = {
          subscribe: (callback: (newState: Type) => void) => {
			_implementSubscribeFunction<Type>(_stateUUID, callback);
		  },
        };

        // Create a new state metatable.
        const rblxStateTable = {
          __call: (_self: any, newState?: Type | ((previousState: Type) => Type)) => {
			// Implement either getter or setter based on the argument, and return the result from that.
			return _implementStateGetterOrSetter(_stateUUID, newState);
		  },
        };

        // Merge the table.
        const rblxState = setmetatable(rblxStateFunctionalTable, (rblxStateTable as unknown as any)) as unknown as RblxState<Type>;

        // Create a new internal state for managing.
        _createNewInternalState(_stateUUID, rblxState, state);

        return rblxState;
    }
}

export = RblxStateManager