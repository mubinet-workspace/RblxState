/*
    Author  : @Mubinet (5220307661)
    Date    : 8/22/2024
*/

import { useEffect, useState } from "@rbxts/react";
import createRblxState from "../CreateRblxState";
import { RblxState } from "..";

function useRblxState<Type>(rblxState: RblxState<Type>) : Type {
    // React State
    const [reactRblxState, setReactRblxState] = useState<Type>(rblxState());

    useEffect(() => {
        // Listen for any updated value of the state.
        const _unsubscribeCallback = rblxState.subscribe((newRblxState) => {
            // Directly update the value of the react RblxState.
            setReactRblxState(newRblxState);
        });

        return () => {
            // Unsubscribe before changing the state.
            _unsubscribeCallback();
        };
    }, [reactRblxState]);

    // Invoke with no argument and return the latest value of the state.
    return rblxState();
}

export = useRblxState