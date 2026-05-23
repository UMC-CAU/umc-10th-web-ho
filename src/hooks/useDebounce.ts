import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // value가 마지막으로 바뀐 뒤 delay가 지나야 실제 검색에 쓰는 값이 갱신됩니다.
        const timerId = window.setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // value/delay 변경 또는 언마운트 시 이전 타이머를 정리해 중복 갱신을 막습니다.
        return () => {
            window.clearTimeout(timerId);
        };
    }, [value, delay]);

    return debouncedValue;
}
