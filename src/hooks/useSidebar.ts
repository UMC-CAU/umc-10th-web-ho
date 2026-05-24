import { useCallback, useEffect, useState } from "react";

export function useSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen((current) => !current), []);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        // Sidebar가 열려 있는 동안 ESC 키를 누르면 닫고, cleanup에서 리스너를 제거합니다.
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                close();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [close, isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        // 모바일 Sidebar 뒤의 페이지가 같이 스크롤되지 않도록 열려 있는 동안 body 스크롤을 잠급니다.
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    return {
        isOpen,
        open,
        close,
        toggle,
    };
}
