"use client";

export default function UserPage({ params }: { params: { id: string } }) {
  const userId = params.id;

  return (
    <div style={{
      maxWidth: "600px",
      margin: "0 auto",
      padding: "40px 20px",
      fontFamily: "sans-serif",
      color: "#333"
    }}>
      
      {/* プロフィールヘッダー */}
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "22px", marginBottom: "10px" }}>
          {userId} のページ
        </h1>
        <p style={{ color: "#666", fontSize: "14px" }}>
          ここに一言メモが入る（後でDBから取得）
        </p>
      </div>

      {/* 投稿一覧 */}
      <div>
        <h2 style={{ fontSize: "18px", marginBottom: "20px" }}>
          最近の投稿
        </h2>

        <div style={{
          background: "#f7f7f7",
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "20px",
          lineHeight: "1.6",
          whiteSpace: "pre-wrap"
        }}>
          投稿サンプル（後でSupabaseから取得）
        </div>
      </div>
    </div>
  );
}
