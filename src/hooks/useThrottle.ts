import { useEffect, useRef, useState } from "react";

export function useThrottle<T>(value: T, interval: number) {
    const [throttledValue, setThrottledValue] = useState(value);
    const lastExecutedTimeRef = useRef(0);
    const timerIdRef = useRef<number | null>(null);

    useEffect(() => {
        const now = Date.now();
        const remainingTime = interval - (now - lastExecutedTimeRef.current);

        if (timerIdRef.current !== null) {
            window.clearTimeout(timerIdRef.current);
        }

        timerIdRef.current = window.setTimeout(
            () => {
                lastExecutedTimeRef.current = Date.now();
                setThrottledValue(value);
            },
            Math.max(remainingTime, 0),
        );

        return () => {
            if (timerIdRef.current !== null) {
                window.clearTimeout(timerIdRef.current);
            }
        };
    }, [value, interval]);

    return throttledValue;
}
