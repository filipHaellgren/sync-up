import { useState } from "react";

export function useToggleState(initialState: boolean): [boolean, () => void] {
    const [state, setState] = useState(initialState);
    
    const toggle = () => {
        setState(!state);
    };
    return [state, toggle];
    }