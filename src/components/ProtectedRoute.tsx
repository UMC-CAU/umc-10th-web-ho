import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ProtectedRouteProps = {
    children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { getItem } = useLocalStorage<string>("ACCESS_TOKEN");
    const token = getItem();

    if (token) {
        return <>{children}</>;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
                <h2 className="text-lg font-semibold text-gray-900">로그인이 필요합니다.</h2>
                <p className="mt-2 text-sm text-gray-600">
                    LP 상세 페이지와 작성 페이지는 로그인 후 이용할 수 있습니다.
                </p>
                <button
                    type="button"
                    className="mt-6 w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                    onClick={() => navigate("/login", { state: { from: location }, replace: true })}
                >
                    확인
                </button>
            </div>
        </div>
    );
}
