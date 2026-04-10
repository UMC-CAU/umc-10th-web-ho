import { z } from "zod";

export const emailSchema = z
    .string()
    .trim()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식을 입력해주세요.");

export const passwordSchema = z
    .string()
    .min(1, "비밀번호를 입력해주세요.")
    .min(8, "비밀번호는 8자 이상이어야 합니다.")
    .max(20, "비밀번호는 20자 이하여야 합니다.");

export const nicknameSchema = z
    .string()
    .trim()
    .min(1, "닉네임을 입력해주세요.");

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

export const signupBaseSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    passwordCheck: z.string().min(1, "비밀번호를 다시 입력해주세요."),
    nickname: nicknameSchema,
});

export const signupSchema = signupBaseSchema
    .refine((value) => value.password === value.passwordCheck, {
        path: ["passwordCheck"],
        message: "비밀번호가 일치하지 않습니다.",
    });

export const signupEmailStepSchema = signupBaseSchema.pick({ email: true });
export const signupPasswordStepSchema = signupBaseSchema.pick({
    password: true,
    passwordCheck: true,
});
export const signupNicknameStepSchema = signupBaseSchema.pick({ nickname: true });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;

export interface AuthToken {
    accessToken: string;
    refreshToken?: string;
}
