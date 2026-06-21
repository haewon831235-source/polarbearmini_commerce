"use client";

import { Suspense } from "react";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { signInAction, type LoginState } from "./actions";
import { Button } from "@/components/ui/button";

const HINTS: Record<string, string> = {
  forbidden: "관리자 권한이 없는 계정입니다.",
  "not-configured":
    "관리자 기능이 아직 설정되지 않았습니다 (Supabase 환경 변수 필요).",
};

function LoginForm() {
  const params = useSearchParams();
  const hint = HINTS[params.get("e") ?? ""];
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    signInAction,
    {},
  );
  const error = state.error ?? hint;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-background p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold">관리자 로그인</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Polaris Atelier 운영 콘솔
        </p>

        <form action={formAction} className="space-y-3">
          <input
            name="email"
            type="email"
            required
            placeholder="이메일"
            autoComplete="username"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="비밀번호"
            autoComplete="current-password"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />

          {error ? (
            <p className="rounded-md bg-destructive/10 p-2 text-xs text-destructive">
              {error}
            </p>
          ) : null}

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "로그인 중…" : "로그인"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
