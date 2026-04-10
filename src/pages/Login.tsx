import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { postLogin } from "../apis/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { loginSchema, type LoginFormValues } from "../types/auth";

const Login = () => {
    const navigate = useNavigate();
    const { setItem: setAuthToken } = useLocalStorage<string>("ACCESS_TOKEN");

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: "onBlur",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleLogin = async (values: LoginFormValues) => {
        const token = await postLogin(values);
        setAuthToken(token.accessToken);
        navigate("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form
                className="flex flex-col gap-3 w-72"
                onSubmit={handleSubmit(handleLogin)}
            >
                <div className="relative flex items-center justify-center my-10">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="absolute left-0 text-xl"
                    >
                        &lt;
                    </button>
                    <h1 className="text-xl">로그인</h1>
                </div>
                <input
                    className="border rounded-md px-4 py-2"
                    type="email"
                    placeholder="이메일"
                    {...register("email")}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
                <input
                    className="border rounded-md px-4 py-2"
                    type="password"
                    placeholder="비밀번호"
                    {...register("password")}
                />
                {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}

                <button 
                    className={`bg-black 
                    text-white 
                    py-2 px-4 
                    rounded-md 
                    ${!isValid || isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!isValid || isSubmitting}
                    type="submit"
                >
                    {isSubmitting ? "로그인 중..." : "로그인"}
                </button>

                <p className="text-center text-sm text-gray-600">
                    계정이 없나요?{" "}
                    <Link to="/signup" className="font-medium text-black underline">
                        회원가입
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Login;   