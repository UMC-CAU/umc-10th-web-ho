import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function GoogleOAuthCallbackPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setItem: setAccessToken } = useLocalStorage<string>("ACCESS_TOKEN");
    const { getItem: getGoogleReturnTo, removeItem: removeGoogleReturnTo } =
        useLocalStorage<string>("GOOGLE_RETURN_TO");

    useEffect(() => {
        const accessToken = searchParams.get("accessToken");
        const returnTo = getGoogleReturnTo();

        if (!accessToken) {
            removeGoogleReturnTo();
            navigate("/login", { replace: true });
            return;
        }

        setAccessToken(accessToken);
        removeGoogleReturnTo();

        navigate(returnTo ?? "/", { replace: true });
    }, [getGoogleReturnTo, navigate, removeGoogleReturnTo, searchParams, setAccessToken]);

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <p className="text-sm text-gray-600">Google 로그인 정보를 확인하는 중입니다...</p>
        </div>
    );
}