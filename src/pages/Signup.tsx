import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import {
    signupEmailStepSchema,
    signupNicknameStepSchema,
    signupPasswordStepSchema,
    signupSchema,
    type SignupFormValues,
} from "../types/auth";
import { postSignup } from "../apis/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";

type SignupStep = 1 | 2 | 3;

function VisibilityIcon({ visible }: { visible: boolean }) {
    if (visible) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
                aria-hidden="true"
            >
                <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        );
    }

    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
            <path d="M4 20 20 4" />
        </svg>
    );
}

export default function Signup() {
    const navigate = useNavigate();
    const [step, setStep] = useState<SignupStep>(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const { setItem: setSignupDraft } = useLocalStorage<SignupFormValues>("signup-draft");

    const {
        register,
        handleSubmit,
        trigger,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        mode: "onBlur",
        defaultValues: {
            email: "",
            password: "",
            passwordCheck: "",
            nickname: "",
        },
    });

    const email = watch("email");
    const password = watch("password");
    const passwordCheck = watch("passwordCheck");
    const nickname = watch("nickname");

    const isEmailStepValid = signupEmailStepSchema.safeParse({ email }).success;
    const isPasswordStepValid = signupPasswordStepSchema.safeParse({
        password,
        passwordCheck,
    }).success;
    const isNicknameStepValid = signupNicknameStepSchema.safeParse({
        nickname,
    }).success;

    const goNextFromEmail = async () => {
        const ok = await trigger("email");
        if (ok) {
            setStep(2);
        }
    };

    const goNextFromPassword = async () => {
        const ok = await trigger(["password", "passwordCheck"]);
        if (ok) {
            setStep(3);
        }
    };

    const onSubmit = async (values: SignupFormValues) => {
        const { passwordCheck, nickname, ...rest } = values;
        setSignupDraft(values);
        await postSignup({ ...rest, name: nickname });
        navigate("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => (step === 1 ? navigate(-1) : setStep((step - 1) as SignupStep))}
                        className="text-lg"
                        aria-label="뒤로가기"
                    >
                        &lt;
                    </button>
                    <h1 className="text-lg font-semibold">회원가입</h1>
                    <span className="text-xs text-gray-500">{step}/3</span>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    {step === 1 && (
                        <>
                            <label className="text-sm font-medium">이메일</label>
                            <input
                                className="border rounded-md px-4 py-2"
                                type="email"
                                placeholder="example@email.com"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}

                            <button
                                type="button"
                                className={`mt-2 rounded-md py-2 px-4 text-white ${
                                    isEmailStepValid
                                        ? "bg-black"
                                        : "bg-gray-300 cursor-not-allowed"
                                }`}
                                onClick={goNextFromEmail}
                                disabled={!isEmailStepValid}
                            >
                                다음
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                                이메일: {email}
                            </div>

                            <label className="text-sm font-medium">비밀번호</label>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 border rounded-md px-4 py-2"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="비밀번호"
                                    {...register("password")}
                                />
                                <button
                                    type="button"
                                    className="border rounded-md px-3 text-sm"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보이기"}
                                >
                                    <VisibilityIcon visible={showPassword} />
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}

                            <label className="text-sm font-medium">비밀번호 재확인</label>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 border rounded-md px-4 py-2"
                                    type={showPasswordConfirm ? "text" : "password"}
                                    placeholder="비밀번호 재확인"
                                    {...register("passwordCheck")}
                                />
                                <button
                                    type="button"
                                    className="border rounded-md px-3 text-sm"
                                    onClick={() => setShowPasswordConfirm((prev) => !prev)}
                                    aria-label={
                                        showPasswordConfirm
                                            ? "비밀번호 재확인 숨기기"
                                            : "비밀번호 재확인 보이기"
                                    }
                                >
                                    <VisibilityIcon visible={showPasswordConfirm} />
                                </button>
                            </div>
                            {errors.passwordCheck && (
                                <p className="text-sm text-red-500">
                                    {errors.passwordCheck.message}
                                </p>
                            )}

                            <button
                                type="button"
                                className={`mt-2 rounded-md py-2 px-4 text-white ${
                                    isPasswordStepValid
                                        ? "bg-black"
                                        : "bg-gray-300 cursor-not-allowed"
                                }`}
                                onClick={goNextFromPassword}
                                disabled={!isPasswordStepValid}
                            >
                                다음
                            </button>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                                이메일: {email}
                            </div>

                            <div className="flex flex-col items-center gap-2 py-2">
                                <div className="h-20 w-20 rounded-full border-2 border-dashed border-gray-300 bg-gray-50" />
                                <button
                                    type="button"
                                    className="text-xs text-gray-500"
                                    disabled
                                >
                                    프로필 이미지 업로드 UI
                                </button>
                            </div>

                            <label className="text-sm font-medium">닉네임</label>
                            <input
                                className="border rounded-md px-4 py-2"
                                type="text"
                                placeholder="닉네임"
                                {...register("nickname")}
                            />
                            {errors.nickname && (
                                <p className="text-sm text-red-500">
                                    {errors.nickname.message}
                                </p>
                            )}

                            <button
                                type="submit"
                                className={`mt-2 rounded-md py-2 px-4 text-white ${
                                    isNicknameStepValid && !isSubmitting
                                        ? "bg-black"
                                        : "bg-gray-300 cursor-not-allowed"
                                }`}
                                disabled={!isNicknameStepValid || isSubmitting}
                            >
                                {isSubmitting ? "처리 중..." : "회원가입 완료"}
                            </button>
                        </>
                    )}
                </form>

                <div className="mt-4 text-center text-sm text-gray-600">
                    이미 계정이 있나요?{" "}
                    <Link to="/login" className="font-medium text-black underline">
                        로그인
                    </Link>
                </div>
            </div>
        </div>
    );
}
