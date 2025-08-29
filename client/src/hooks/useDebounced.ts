import React from "react";

// 🕒 debounce hook
function useDebounced<T>(value: T, delay = 250) {
    const [v, setV] = React.useState(value);
    React.useEffect(() => {
        const id = setTimeout(() => setV(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return v;
}

export default useDebounced