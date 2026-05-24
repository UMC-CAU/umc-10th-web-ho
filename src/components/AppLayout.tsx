import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useSidebar } from "../hooks/useSidebar";
import Header from "./Header";
import LpCreateModal from "./LpCreateModal";
import Sidebar from "./Sidebar";

export default function AppLayout() {
    const sidebar = useSidebar();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-950">
            <Header onMenuClick={sidebar.toggle} />
            <div className="flex min-h-[calc(100vh-64px)]">
                <Sidebar isOpen={sidebar.isOpen} onClose={sidebar.close} />
                <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
                    <Outlet />
                </main>
            </div>
            <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-3xl leading-none text-white shadow-lg transition hover:scale-105 hover:bg-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-200"
                aria-label="LP 작성"
            >
                +
            </button>
            <LpCreateModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </div>
    );
}
