import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useLoginMutation } from "../hooks/useAuthMutations";
import { loginSchema, type LoginFormValues } from "../types/auth";

type LocationState = {
    from?: {
        pathname: string;
        search?: string;
    };
};

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState | null;
    const fromPath = state?.from ? `${state.from.pathname}${state.from.search ?? ""}` : "/";
    const loginMutation = useLoginMutation(fromPath);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: "onBlur",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleLogin = (values: LoginFormValues) => loginMutation.mutate(values);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <form
                className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                onSubmit={handleSubmit(handleLogin)}
            >
                <div className="mb-8 flex items-center justify-between">
                    <button type="button" onClick={() => navigate(-1)} className="text-xl">
                        &lt;
                    </button>
                    <h1 className="text-xl font-semibold">로그인</h1>
                    <span className="w-5" />
                </div>

                <div className="grid gap-3">
                    <input
                        className="rounded-md border border-gray-200 px-4 py-2"
                        type="email"
                        placeholder="이메일"
                        {...register("email")}
                    />
                    {errors.email ? <p className="text-sm text-red-500">{errors.email.message}</p> : null}

                    <input
                        className="rounded-md border border-gray-200 px-4 py-2"
                        type="password"
                        placeholder="비밀번호"
                        {...register("password")}
                    />
                    {errors.password ? <p className="text-sm text-red-500">{errors.password.message}</p> : null}

                    <button
                        className="rounded-md bg-gray-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!isValid || loginMutation.isPending}
                        type="submit"
                    >
                        {loginMutation.isPending ? "로그인 중..." : "로그인"}
                    </button>
                </div>

                <div className="my-4 flex items-center gap-3">
                    <span className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs text-gray-400">또는</span>
                    <span className="h-px flex-1 bg-gray-200" />
                </div>

                <GoogleLoginButton returnTo={fromPath} />

                <p className="mt-4 text-center text-sm text-gray-600">
                    계정이 없나요?{" "}
                    <Link to="/signup" className="font-medium text-gray-950 underline">
                        회원가입
                    </Link>
                </p>
            </form>
        </div>
    );
}
