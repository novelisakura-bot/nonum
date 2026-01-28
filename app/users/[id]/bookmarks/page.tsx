"use client";
export default function BookmarksPage({ params }: { params: { id: string } }) {
  return (
    <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>栞</h1>
      <p>ユーザーID: {params.id} の保存した投稿一覧（予定）</p>
      <p>※ここにも「数字」は一切表示しません。</p>
    </main>
  );
}