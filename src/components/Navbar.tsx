import { NavLink } from "react-router-dom";

const LINKS = [
    {to:'/',label:'홈'},
    {to:'/movies/popular',label:'인기 영화'},
    {to:'/movies/now_playing',label:'상영 중'},
    {to:'/movies/top_rated',label:'높은 평점'},
    {to:'/movies/upcoming',label:'개봉 박두'},
    {to:'/login',label:'로그인'},
    {to:'/signup',label:'회원가입'},
];

export const Navbar= () => {
    const loginLink = LINKS.find((link) => link.to === '/login');
    const menuLinks = LINKS.filter((link) => link.to !== '/login');

    return (
        <div className="relative flex w-full items-center p-4">
            {loginLink && (
                <NavLink
                    to={loginLink.to}
                    className={({ isActive }) => (isActive ? 'absolute left-4 text-blue-700 font-bold' : 'absolute left-4 text-gray-500')}
                >
                    {loginLink.label}
                </NavLink>
            )}

            <div className="mx-auto flex gap-3">
                {menuLinks.map(({ to, label }) => (
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