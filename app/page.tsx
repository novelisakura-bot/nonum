"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Post = {
  id: number;
  content: string;
  created_at: string;
};


export default function Home() {
  const [showInput, setShowInput] = useState(false);
  const [text, setText] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const userId = "me"; // ← 仮。あとでSupabaseから取得する

  const handlePost = async () => {
    if (text.trim() === "") return; // 投稿文が空文字なら何もしないでリターン

    // supabase に保存
    const { data, error } = await supabase.from("posts").insert({ content: text }).select();

    // 投稿が保存されてない場合。
    if (error) {
      //終了するよ。
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
    const loadPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*");

      console.log(data);
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
    <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
      No Num.
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
        <Link href={`/users/${userId}`}>プロフィール</Link>
        <Link href={`/users/${userId}/followings`}>仲良くなりたい人</Link>
        <Link href={`/users/${userId}/bookmarks`}>かっこいい！しおり</Link>
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
            placeholder="いまの気持ちを書いてみる"
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
        {posts.map((p) => (
          <div
            key={p.id}
            style={{
              background: "#f7f7f7",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "20px",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap"
            }}
          >{p.content}
            
          </div>
        ))}
      </div>
    </div>
  );
}
