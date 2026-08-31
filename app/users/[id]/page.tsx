
export const dynamic = "force-dynamic";

import Link from "next/link";


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

    
      <div style={{ backgroundColor: "#f7f9fa", minHeight: "100vh", color: "#0f1419", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      
      {/* ヘッダー・ナビゲーションエリア */}
      <header style={{ backgroundColor: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid #eff3f4" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "12px 16px 0 16px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 12px 0", letterSpacing: "-0.5px" }}>
            No Num.
          </h1>

          <nav style={{ display: "flex", gap: "20px", fontSize: "14px", fontWeight: 600 }}>
            <Link href="/main" style={{ color: "#0f1419", textDecoration: "none", paddingBottom: "8px", borderBottom: "3px solid #0f1419" }}>
              TL
            </Link>
            <Link href={`/users/${userId}`} style={{ color: "#536471", textDecoration: "none", paddingBottom: "8px" }}>
              プロフィール
            </Link>
            <Link href={`/users/${userId}/followings`} style={{ color: "#536471", textDecoration: "none", paddingBottom: "8px" }}>
              仲良くなりたい人
            </Link>
            <Link href={`/users/${userId}/bookmarks`} style={{ color: "#536471", textDecoration: "none", paddingBottom: "8px" }}>
              しおり
            </Link>
          </nav>
        </div>
      </header>
      </div>

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
