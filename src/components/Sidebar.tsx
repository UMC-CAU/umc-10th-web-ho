import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useWithdrawMutation } from "../hooks/useAuthMutations";
import { useCurrentUser } from "../hooks/useCurrentUser";

type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

const links = [
    { to: "/", label: "LP 목록" },
    { to: "/lp/new", label: "LP 작성" },
    { to: "/profile", label: "마이페이지" },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    return (
        <>
            <aside className="hidden w-60 shrink-0 border-r border-gray-200 bg-white p-4 md:block">
                <SidebarContent />
            </aside>

            {isOpen ? (
                <div className="fixed inset-0 z-40 md:hidden" aria-modal="true" role="dialog">
                    <button type="button" className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="사이드바 닫기" />
                    <aside className="relative h-full w-64 bg-white p-4 shadow-xl">
                        <SidebarContent onNavigate={onClose} />
                    </aside>
                </div>
            ) : null}
        </>
    );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const { isLoggedIn } = useCurrentUser();
    const withdrawMutation = useWithdrawMutation();

    return (
        <div className="flex h-full flex-col justify-between gap-6">
            <div>
                <p className="text-xs font-semibold uppercase text-gray-400">Menu</p>
                <div className="mt-3 grid gap-1">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={onNavigate}
                            className={({ isActive }) =>
                                `rounded-md px-3 py-2 text-sm transition ${
                                    isActive
                                        ? "bg-pink-50 font-semibold text-pink-600"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>
            </div>

            {isLoggedIn ? (
                <button
                    type="button"
                    onClick={() => setIsConfirmOpen(true)}
                    className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                    탈퇴하기
                </button>
            ) : null}

            {isConfirmOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
                    <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-semibold text-gray-950">정말 탈퇴하시겠습니까?</h2>
                        <p className="mt-2 text-sm text-gray-600">예를 누르면 계정 삭제 API를 호출합니다.</p>
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
                                onClick={() => setIsConfirmOpen(false)}
                            >
                                아니오
                            </button>
                            <button
                                type="button"
                                disabled={withdrawMutation.isPending}
                                className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60"
                                onClick={() => withdrawMutation.mutate()}
                            >
                                {withdrawMutation.isPending ? "처리 중..." : "예"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
