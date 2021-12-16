import { useState, useEffect } from "react";

function getStorageValue(key: string, defaultValue: any) {
    if (typeof window === "undefined") {
        return defaultValue;
    }

    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
}

export function useLocalStorage<Type>(
    key: string,
    defaultValue: any
): [Type, React.Dispatch<React.SetStateAction<Type>>] {
    const [value, setValue] = useState(() => {
        return getStorageValue(key, defaultValue);
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}
