import { getGoogleLoginUrl } from "../apis/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";

type GoogleLoginButtonProps = {
    returnTo?: string;
};

export default function GoogleLoginButton({ returnTo }: GoogleLoginButtonProps) {
    const { setItem: setGoogleReturnTo } = useLocalStorage<string>("GOOGLE_RETURN_TO");

    const handleGoogleLogin = () => {
        if (returnTo) {
            setGoogleReturnTo(returnTo);
        }

        window.location.assign(getGoogleLoginUrl());
    };

    return (
        <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
        >
            <span className="h-4 w-4 rounded-full bg-[conic-gradient(from_180deg,#4285F4_0_25%,#34A853_25%_50%,#FBBC05_50%_75%,#EA4335_75%_100%)]" />
            Google로 로그인
        </button>
    );
}
