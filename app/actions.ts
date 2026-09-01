"use server";

import { redirect } from "next/navigation";
import { createClient } from "./utils/supabase/server"; // appの1つ上の utils を見に行く場合

// ログイン関数（アカウントをお持ちの方）
export async function login(formData: FormData) {
  const supabase = await createClient(); // awaitが必要な場合があります

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // エラー時はクエリパラメータを付けて戻すのが最小構成での定石
    redirect("/?error=failed");
  }

  redirect("/main");
}

// サインアップ関数（アカウントがない方
export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { success: false, message: '登録に失敗しました。' }
  }

  // 登録後は確認メールが飛ぶ設定の場合が多いので、一旦トップへ
  return {
    success: true,
    message: '入力したメールアドレスにメールを送信しました。確認してリンクから再度ログインしてください。',
  }
}