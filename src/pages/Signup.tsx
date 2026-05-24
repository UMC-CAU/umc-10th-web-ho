import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { postSignup } from "../apis/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
    signupEmailStepSchema,
    signupNicknameStepSchema,
    signupPasswordStepSchema,
    signupSchema,
    type SignupFormValues,
} from "../types/auth";

type SignupStep = 1 | 2 | 3;

export default function Signup() {
    const navigate = useNavigate();
    const [step, setStep] = useState<SignupStep>(1);
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
    const isPasswordStepValid = signupPasswordStepSchema.safeParse({ password, passwordCheck }).success;
    const isNicknameStepValid = signupNicknameStepSchema.safeParse({ nickname }).success;

    const onSubmit = async (values: SignupFormValues) => {
        setSignupDraft(values);
        await postSignup({
            email: values.email,
            password: values.password,
            name: values.nickname,
        });
        navigate("/login");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
                    {step === 1 ? (
                        <>
                            <label className="text-sm font-medium">이메일</label>
                            <input
                                className="rounded-md border border-gray-200 px-4 py-2"
                                type="email"
                                placeholder="example@email.com"
                                {...register("email")}
                            />
                            {errors.email ? <p className="text-sm text-red-500">{errors.email.message}</p> : null}
                            <button
                                type="button"
                                className="mt-2 rounded-md bg-gray-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                                onClick={async () => (await trigger("email")) && setStep(2)}
                                disabled={!isEmailStepValid}
                            >
                                다음
                            </button>
                        </>
                    ) : null}

                    {step === 2 ? (
                        <>
                            <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">이메일: {email}</div>
                            <label className="text-sm font-medium">비밀번호</label>
                            <input
                                className="rounded-md border border-gray-200 px-4 py-2"
                                type="password"
                                placeholder="비밀번호"
                                {...register("password")}
                            />
                            {errors.password ? (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            ) : null}
                            <label className="text-sm font-medium">비밀번호 확인</label>
                            <input
                                className="rounded-md border border-gray-200 px-4 py-2"
                                type="password"
                                placeholder="비밀번호 확인"
                                {...register("passwordCheck")}
                            />
                            {errors.passwordCheck ? (
                                <p className="text-sm text-red-500">{errors.passwordCheck.message}</p>
                            ) : null}
                            <button
                                type="button"
                                className="mt-2 rounded-md bg-gray-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                                onClick={async () => (await trigger(["password", "passwordCheck"])) && setStep(3)}
                                disabled={!isPasswordStepValid}
                            >
                                다음
                            </button>
                        </>
                    ) : null}

                    {step === 3 ? (
                        <>
                            <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">이메일: {email}</div>
                            <label className="text-sm font-medium">닉네임</label>
                            <input
                                className="rounded-md border border-gray-200 px-4 py-2"
                                type="text"
                                placeholder="닉네임"
                                {...register("nickname")}
                            />
                            {errors.nickname ? (
                                <p className="text-sm text-red-500">{errors.nickname.message}</p>
                            ) : null}
                            <button
                                type="submit"
                                className="mt-2 rounded-md bg-gray-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                                disabled={!isNicknameStepValid || isSubmitting}
                            >
                                {isSubmitting ? "처리 중..." : "회원가입 완료"}
                            </button>
                        </>
                    ) : null}
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    이미 계정이 있나요?{" "}
                    <Link to="/login" className="font-medium text-gray-950 underline">
                        로그인
                    </Link>
                </p>
            </div>
        </div>
    );
}
