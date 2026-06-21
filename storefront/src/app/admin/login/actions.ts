"use server";

import { redirect } from "next/navigation";
import { getSupabaseAuthClient } from "@/lib/supabase/admin-auth";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export type LoginState = { error?: string };

// Email/password sign-in for /admin. On success, confirms the user is on the
// admin_user allowlist before redirecting into the dashboard.
export async function signInAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "이메일과 비밀번호를 입력하세요." };

  const supabase = await getSupabaseAuthClient();
  if (!supabase) return { error: "관리자 기능이 아직 설정되지 않았습니다 (Supabase 환경 변수 필요)." };

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.user) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  // Allowlist check — a valid Supabase user is not necessarily an admin.
  const service = getSupabaseServiceClient();
  const { data: allow } = service
    ? await service
        .from("admin_user")
        .select("user_id")
        .eq("user_id", data.user.id)
        .maybeSingle()
    : { data: null };

  if (!allow) {
    await supabase.auth.signOut();
    return { error: "관리자 권한이 없는 계정입니다." };
  }

  redirect("/admin");
}

export async function signOutAction() {
  const supabase = await getSupabaseAuthClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}
