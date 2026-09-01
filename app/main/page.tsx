'use client';

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

type Post = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
};


export default function Home() {
  const [showInput, setShowInput] = useState(false);
  const [text, setText] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const userId = "me"; // ← 仮。あとでSupabaseから取得する

  // 投稿ボタン押下で発火する処理。
  const handlePost = async () => {
    if (text.trim() === "") return; // 投稿文が空文字なら何もしないでリターン

    // ログイン中のユーザーを取得
    const { data: { user } } = await supabase.auth.getUser();
    console.log("現在ログイン中のユーザー:", user);
    if (!user) {
      console.error("ログインしていません");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    console.log("送信時のアクセストークン:", session?.access_token);
    // 投稿を保存
    const { data, error } = await supabase
      .from("posts").insert({
      user_id: user.id,
      content: text,
    }).select();

    if (error) {
      console.error(error);
      return;
    }

    //投稿一覧を更新する。
    setPosts([data[0], ...posts]);

    // 投稿ダイアログっぽいsomethingを閉じる
    setText("");
    setShowInput(false);
  };

useEffect(() => {
  const getUser = async () => {
    const { data } = await supabase.auth.getSession();
    console.log("session:", data);
  };
  getUser();
}, []);

useEffect(() => {
  const loadPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setPosts(data || []);
  };

  loadPosts();
}, []);

  return (
    <div style={{
      maxWidth: "600px",
      margin: "0 auto",
      padding: "40px 20px",
      fontFamily: "sans-serif",
      background: "#fff",
      color: "#333"
    }}>

    {/* タイトルです。 */}
    <h1
      style={{
        fontFamily: '"Playfair Display", "Yu Mincho", "游明朝", serif',
        fontSize: "28px",
        fontWeight: "700",          // 極太にしてロゴ感を出す
        letterSpacing: "-0.02em",   // 文字間を少し詰めてキュッとする
        color: "#18181b",           // 真っ黒ではなく少し青みのある濃い色
        marginBottom: "24px"
      }}
    >
      No Num<span style={{ color: "#3b82f6" }}>.</span> {/* ドットだけアクセントカラーにするのもアリ */}
    </h1>
    
    {/* ナビです。 */}
    <div style={{ padding: 20 }}>
      <nav style={{
        display: "flex",
        gap: "24px",
        marginBottom: "30px",
        borderBottom: "1px solid #ddd",
        fontSize: "14px",
        background: "#fff",
        color: "#555"
      }}>
        <Link href={`/main/`}>TL</Link>
        <Link href={`/users/${userId}`}>プロフィール</Link>
        <Link href={`/users/${userId}/followings`}>仲良くなりたい人</Link>
        <Link href={`/users/${userId}/bookmarks`}>しおり</Link>
      </nav>

      {/* ここに投稿一覧とかが続く */}
    </div>


    {/* 投稿するボタンです。 */}
    {!showInput && (
      <button
        onClick={() => setShowInput(true)}
        style={{
          padding: "10px 20px",
          background: "#222",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        投稿する
      </button>
    )}

    {/* ダイアログのつもりです。 */}
      {showInput && (
        <div style={{ marginTop: "20px" }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "16px",
              resize: "none"
            }}
            placeholder="今日も元気にいちにのさん"
          />
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={handlePost}
              style={{
                padding: "8px 16px",
                background: "#444",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                marginRight: "10px"
              }}
            >
              投稿
            </button>
            <button
              onClick={() => setShowInput(false)}
              style={{
                padding: "8px 16px",
                background: "#aaa",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}


    {/* 投稿一覧です。 */}
      <div style={{ marginTop: "40px" }}>
        {posts.map((p) => {
          // 日時の整形（ISO文字列などを綺麗なフォーマットに変換）
            const formattedDate = p.created_at
            ? new Intl.DateTimeFormat("ja-JP", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(p.created_at))
              : "";          
          return (
          // 投稿カード全体のdiv
          <div
            key={p.id}
            style={{
              background: "#ffffff",
              borderBottom: "1px solid #e2e8f0",
              padding: "20px",
              marginBottom: "0px",
              lineHeight: "1.6",
            }}
          >



            {/* ヘッダー：IDと日時 */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
                fontSize: "12px",
                color: "64748b",
              }}
            >
          
              {/* IDを短縮してバッジ風に表示 */}
              <span
                style={{
                  fontFamily: "monospace",
                  background: "#f1f5f9",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontWeight: 600,
                }}
              >
                #{String(p.user_id).slice(0, 8)}
              </span>

              {/* 投稿日時 */}
                <time>{formattedDate}</time>
            </div>



            {/* 投稿1つ1つのスタイルとか。 */}
            {
              <div style={{
                fontSize: "15px",
                color: "#1a2b3c",
                lineHeight: "1.7",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}>
                {p.content}
              </div> // 投稿1つ1つのスタイルとか。
            }
          </div> // 投稿カード全体のdiv
      );})}
      </div>
    </div>
  );
}
