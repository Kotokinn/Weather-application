import { useRef, useCallback } from "react";

export function useLongPress(callback: (e: React.MouseEvent | React.TouchEvent) => void, ms = 800) {
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const start = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        timerRef.current = setTimeout(() => callback(e), ms);
    }, [callback, ms]);

    const clear = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    return {
        onMouseDown: start,
        onMouseUp: clear,
        onMouseLeave: clear,
        onTouchStart: start,
        onTouchEnd: clear,
        onTouchCancel: clear,
    };
}
