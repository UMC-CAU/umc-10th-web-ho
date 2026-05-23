# react-hook-form 학습 내용 정리

- useForm으로 입력값, 에러, 제출 상태를 한 곳에서 관리할 수 있다.
- mode를 onChange로 두면 입력 즉시 유효성 상태를 UI에 반영할 수 있다.
- register로 input을 연결하고, handleSubmit으로 제출 로직을 안전하게 분리한다.
- trigger를 사용하면 다단계 폼에서 현재 단계 필드만 검증할 수 있다.
- formState의 errors, isValid, isSubmitting을 이용해 버튼 비활성화와 에러 메시지를 일관되게 처리할 수 있다.

# Zod 학습 내용 정리

- Zod 스키마로 이메일, 비밀번호, 닉네임 규칙을 선언적으로 정의할 수 있다.
- min, email, refine를 조합해 길이 검증, 형식 검증, 교차 필드 검증(비밀번호 일치)을 처리한다.
- zodResolver를 통해 react-hook-form과 연결하면 스키마가 곧 폼 유효성 규칙이 된다.
- z.infer를 활용해 폼 타입을 자동 생성하면 중복 타입 선언 없이 타입 안정성을 유지할 수 있다.

# 타입 안정성 및 커스텀 훅

- SignupFormValues, LoginFormValues 타입을 스키마에서 추론해 폼 데이터 타입을 안전하게 유지했다.
- useLocalStorage 커스텀 훅으로 토큰/임시 회원가입 데이터를 JSON 직렬화해 저장하고 재사용할 수 있게 구성했다.
