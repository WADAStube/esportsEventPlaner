import { useState, useEffect } from "react";

export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "20px",
        zIndex: 100,
        width: "38px",
        height: "38px",
        borderRadius: "50%",
        background: "rgba(0,229,255,0.12)",
        border: "1px solid rgba(0,229,255,0.3)",
        color: "#00e5ff",
        fontSize: "16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
        boxShadow: "0 0 16px rgba(0,229,255,0.15)",
        transition: "all 0.2s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,229,255,0.22)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 24px rgba(0,229,255,0.3)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,229,255,0.12)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px rgba(0,229,255,0.15)";
      }}
      title="Nach oben"
    >
      ↑
    </button>
  );
}
