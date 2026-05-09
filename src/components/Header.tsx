import { Link, NavLink, useNavigate } from "react-router-dom";
import { postSignOut } from "../apis/auth";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useLocalStorage } from "../hooks/useLocalStorage";

type HeaderProps = {
    onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
    const navigate = useNavigate();
    const { user, isLoggedIn } = useCurrentUser();
    const { removeItem: removeAccessToken } = useLocalStorage<string>("ACCESS_TOKEN");
    const { removeItem: removeRefreshToken } = useLocalStorage<string>("REFRESH_TOKEN");
    const { removeItem: removeUser } = useLocalStorage<string>("USER");

    const handleLogout = async () => {
        try {
            await postSignOut();
        } finally {
            removeAccessToken();
            removeRefreshToken();
            removeUser();
            navigate("/login", { replace: true });
        }
    };

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
            <div className="flex min-w-0 items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 md:hidden"
                    aria-label="사이드바 열기"
                >
                    {/*
                      Vite에서 SVG를 쓰는 방법:
                      1. JSX inline SVG로 직접 작성
                      2. public 폴더에 SVG 파일을 넣고 <img src="/menu.svg" />로 사용
                      3. SVGR 설정 후 React 컴포넌트처럼 import해서 사용

                      현재 버거 아이콘은 JSX inline SVG 방식으로 사용합니다.
                    */}
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
                        <span className="hidden text-gray-700 sm:inline">
                            {user?.name ?? "사용자"}님 반갑습니다.
                        </span>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-md border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            로그아웃
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
