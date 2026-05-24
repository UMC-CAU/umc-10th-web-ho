import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../hooks/useAuthMutations";
import { useCurrentUser } from "../hooks/useCurrentUser";

type HeaderProps = {
    onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
    const navigate = useNavigate();
    const { user, isLoggedIn } = useCurrentUser();
    const logoutMutation = useLogoutMutation();

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
            <div className="flex min-w-0 items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 md:hidden"
                    aria-label="사이드바 열기"
                >
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7"
                        aria-hidden="true"
                    >
                        <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="4"
                            d="M7.95 11.95h32m-32 12h32m-32 12h32"
                        />
                    </svg>
                </button>
                <Link to="/" className="truncate text-xl font-bold text-pink-500">
                    WEEK6 LP
                </Link>
            </div>

            <nav className="hidden items-center gap-4 text-sm md:flex">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "font-semibold text-pink-600" : "text-gray-500 hover:text-gray-900"
                    }
                >
                    LP 목록
                </NavLink>
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        isActive ? "font-semibold text-pink-600" : "text-gray-500 hover:text-gray-900"
                    }
                >
                    마이페이지
                </NavLink>
            </nav>

            <div className="flex shrink-0 items-center gap-2 text-sm">
                {isLoggedIn ? (
                    <>
                        <span className="hidden text-gray-700 sm:inline">{user?.name ?? "사용자"}님 반갑습니다.</span>
                        <button
                            type="button"
                            onClick={() => logoutMutation.mutate()}
                            disabled={logoutMutation.isPending}
                            className="rounded-md border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                        >
                            {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="rounded-md border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            로그인
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/signup")}
                            className="rounded-md bg-gray-900 px-3 py-2 text-white hover:bg-gray-700"
                        >
                            회원가입
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}
