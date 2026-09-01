'use client'
import { useActionState } from 'react'
import { login, signup } from "./actions";

export default function LoginPage() {
  const [state, signupAction, isPending] = useActionState(signup, null) // サインアップボタンを押した結果
  return (
    <div style={styles.container}>
      <form style={styles.form}>
        <label htmlFor="email" style={styles.label}>Email</label>
        <input id="email" name="email" type="email" required style={styles.input} />

        <label htmlFor="password" style={styles.label}>Password</label>
        <input id="password" name="password" type="password" required style={styles.input} />

        <div style={styles.buttonRow}>
          <button formAction={login} style={styles.buttonPrimary}>Log in</button>
          <button formAction={signupAction} disabled={isPending} style={styles.buttonSecondary}>
            {isPending ? '送信中...' : 'Sign up'}
          </button>        
        </div>

        {/* 登録完了・エラーメッセージの表示 */}
        {state?.message && (
          <p style={{ fontSize: '14px', lineHeight: '1.5', marginTop: '8px',color: state.success ? '#2563eb' : '#ef4444'}}>{state.message}</p>
        )}
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f7f7f7",
  },
  form: {
    width: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "32px",
    borderRadius: "12px",
    background: "white",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },
  label: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "-8px",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    color: "#111",
    fontSize: "15px",
    outline: "none",
    transition: "border 0.2s",
  },
  buttonRow: {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
  },
  buttonPrimary: {
    flex: 1,
    padding: "12px 0",
    borderRadius: "8px",
    border: "none",
    background: "#111",
    color: "white",
    fontSize: "15px",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  buttonSecondary: {
    flex: 1,
    padding: "12px 0",
    borderRadius: "8px",
    border: "1px solid #111",
    background: "white",
    color: "#111",
    fontSize: "15px",
    cursor: "pointer",
    transition: "background 0.2s",
  },
} as const;

