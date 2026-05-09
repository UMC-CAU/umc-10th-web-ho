import { NavLink } from "react-router-dom";

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
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/40"
                        onClick={onClose}
                        aria-label="사이드바 닫기"
                    />
                    <aside className="relative h-full w-64 bg-white p-4 shadow-xl">
                        <SidebarContent onNavigate={onClose} />
                    </aside>
                </div>
            ) : null}
        </>
    );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
    return (
        <div className="flex h-full flex-col gap-6">
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
        </div>
    );
}
