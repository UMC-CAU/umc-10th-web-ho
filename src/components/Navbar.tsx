import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { postSignOut } from "../apis/auth";

const LINKS = [
    {to:'/',label:'홈'},
    {to:'/movies/popular',label:'인기 영화'},
    {to:'/movies/now_playing',label:'상영 중'},
    {to:'/movies/top_rated',label:'높은 평점'},
    {to:'/movies/upcoming',label:'개봉 박두'},
    {to:'/profile',label:'프로필'},
];

export const Navbar= () => {
    const navigate = useNavigate();
    const { getItem, removeItem } = useLocalStorage<string>("ACCESS_TOKEN");
    const isLoggedIn = Boolean(getItem());
    const loginLinks = [
        { to: "/login", label: "로그인" },
        { to: "/signup", label: "회원가입" },
    ];

    const handleLogout = async () => {
        try {
            await postSignOut();
        } finally {
            removeItem();
            navigate("/login", { replace: true });
        }
    };

    return (
        <div className="relative flex w-full items-center p-4">
            <div className="absolute left-4 flex items-center gap-3 text-sm">
                {!isLoggedIn ? (
                    loginLinks.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                isActive ? 'text-blue-700 font-bold' : 'text-gray-500'
                            }
                        >
                            {label}
                        </NavLink>
                    ))
                ) : (
                    <button type="button" onClick={handleLogout} className="text-gray-500">
                        로그아웃
                    </button>
                )}
            </div>

            <div className="mx-auto flex gap-3">
                {LINKS.map(({ to, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) => (isActive ? 'text-blue-700 font-bold' : 'text-gray-500')}
                    >
                        {label}
                    </NavLink>
                ))}
            </div>
        </div>
    )
};