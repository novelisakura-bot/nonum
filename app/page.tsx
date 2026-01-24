"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [showInput, setShowInput] = useState(false);
  const [text, setText] = useState("");
  const [posts, setPosts] = useState<string[]>([]);
  const userId = "me"; // ← 仮。あとでSupabaseから取得する


  const handlePost = () => {
    if (text.trim() === "") return;
    setPosts([text, ...posts]);
    setText("");
    setShowInput(false);
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "0 auto",
      padding: "40px 20px",
      fontFamily: "sans-serif",
      color: "#333"
    }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        No Num.
      </h1>

    <div style={{ padding: 20 }}>
      <nav style={{
        display: "flex",
        gap: "20px",
        marginBottom: "30px",
        borderBottom: "1px solid #ddd",
        paddingBottom: "10px"
      }}>
        <Link href={`/users/${userId}`}>プロフィール</Link>
        <Link href={`/users/${userId}/followings`}>仲良くなりたい人</Link>
        <Link href={`/users/${userId}/bookmarks`}>しおり</Link>
      </nav>

      {/* ここに投稿一覧とかが続く */}
    </div>


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

      <div style={{ marginTop: "40px" }}>
        {posts.map((p, i) => (
          <div
            key={i}
            style={{
              background: "#f7f7f7",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "20px",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap"
            }}
          >
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}
