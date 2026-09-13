import type { Metadata } from "next";

// Rendered MP4 hosted on Vercel Blob (store cafe-video). Re-upload with:
//   vercel blob put out/cafe-blr-001-whiteboard.norm.mp4 --pathname cafe-blr-001.mp4 --rw-token $BLOB_READ_WRITE_TOKEN
export const VIDEO_URL = "https://lqgksrd9nxnszrvc.public.blob.vercel-storage.com/cafe-blr-001.mp4";

export const metadata: Metadata = {
  title: "The Economics of Owning a Café in Bangalore · Not a Startup",
  description: "Whiteboard explainer episode, rendered from the slideshow.",
};

export default function WatchPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--paper)",
        color: "var(--ink)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 16px 64px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <p style={{ color: "var(--accent)", letterSpacing: "0.18em", fontSize: 12, fontWeight: 700, margin: "0 0 8px" }}>NOT A STARTUP</p>
      <h1 style={{ fontFamily: "Kalam, cursive", fontSize: 40, margin: "0 0 24px", textAlign: "center" }}>The Economics of Owning a Café in Bangalore</h1>
      <video
        src={VIDEO_URL}
        controls
        playsInline
        preload="metadata"
        style={{ width: "100%", maxWidth: 1280, aspectRatio: "16 / 9", background: "#000", borderRadius: 8 }}
      />
      <p style={{ color: "var(--mute)", fontSize: 14, marginTop: 20, textAlign: "center", maxWidth: 720 }}>
        Rendered from the live slideshow. Interactive version: <a href="/present" style={{ color: "var(--accent)" }}>/present</a> ·
        manual presenter: <a href="/present?mode=manual" style={{ color: "var(--accent)" }}>/present?mode=manual</a>
      </p>
    </main>
  );
}
