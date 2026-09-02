'use client';

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/server"; // appの1つ上の utils を見に行く場合
import { supabase } from "../../lib/supabaseClient";

// 型定義
type Post = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  is_bookmarked?: boolean; // しおりが挟まれているか
};

export default function Home() {
  const [showInput, setShowInput] = useState(false);
  const [text, setText] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const userId = "me"; // ← 仮。あとでSupabaseから取得する


  // ブクマ
// Supabaseクライアント作成

  // 1. 投稿一覧と「自分がしおりを挟んだか」の情報を取得
  const loadPosts = async () => {
    // ログインユーザーを取得
    const { data: { user } } = await supabase.auth.getUser();

    // 投稿一覧を取得
    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (postsError) {
      console.error(postsError);
      return;
    }

    // ログイン中の場合、自分がしおりを挟んだ投稿IDのリストを取得
    let myBookmarkPostIds: string[] = [];
    if (user) {
      const { data: bookmarkData } = await supabase
        .from("bookmarks")
        .select("post_id")
        .eq("user_id", user.id);

      if (bookmarkData) {
        myBookmarkPostIds = bookmarkData.map((b) => b.post_id);
      }
    }

    // 投稿一覧データに is_bookmarked フラグを付与してstateにセット
    const formattedPosts = (postsData || []).map((post) => ({
      ...post,
      is_bookmarked: myBookmarkPostIds.includes(post.id),
    }));

    setPosts(formattedPosts);
  };

  useEffect(() => {
    loadPosts();
  }, []);
  
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

    // 新規投稿を追加（初期状態はしおりOFF）
    if (data && data[0]) {
      setPosts([{ ...data[0], is_bookmarked: false }, ...posts]);
    }

    // 投稿ダイアログっぽいsomethingを閉じる
    setText("");
    setShowInput(false);
  };


  // 3. しおり（ブックマーク）のON/OFF切り替え関数★追加★
  const handleBookmark = async (postId: string, currentIsBookmarked?: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("しおりを挟むにはログインが必要です");
      return;
    }

    // ① 画面上の見た目を即座に反転させる（ローカル更新で爆速化）
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId ? { ...p, is_bookmarked: !currentIsBookmarked } : p
      )
    );

    // ② Supabase DBの更新
    if (currentIsBookmarked) {
      // 既にしおりがあれば削除
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", postId);

      if (error) console.error("しおり削除失敗:", error);
    } else {
      // しおりが無ければ追加
      const { error } = await supabase
        .from("bookmarks")
        .insert({
          user_id: user.id,
          post_id: postId,
        });

      if (error) console.error("しおり追加失敗:", error);
    }
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
        <Link href={`/users/${userId}/followings`}>フォロー</Link>
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
                color: "#64748b",
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



            {/* 投稿本文 */}
            {
              <div style={{
                fontSize: "15px",
                color: "#1a2b3c",
                lineHeight: "1.7",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}>
                {p.content}
              </div> // 投稿本文
            }


            {/* フッター：しおりボタン */}
            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "8px",
            }}>
              <button
                onClick={() => handleBookmark(p.id)} // しおり保存用のハンドラー
                style={{
                  background: "transparent",
                  border: "none",
                  color: p.is_bookmarked ? "#3b82f6" : "#94a3b8", // 保存済みならアクセントカラー（青）
                  cursor: "pointer",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  transition: "color 0.2s, background 0.2s",
                }}
              >
                {/* SVGアイコン（SVGを使うとより洗練されます） */}
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill={p.is_bookmarked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                 strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            </div>
          </div> // 投稿カード全体のdiv
      );})}
      </div>
    </div>
  );
}
