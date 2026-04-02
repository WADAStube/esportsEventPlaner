export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{
      position: "relative",
      marginTop: "64px",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      overflow: "hidden",
    }}>
      {/* top glow line */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "50%", height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.25), transparent)",
      }} />

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 24px 20px",
        gap: "12px",
      }}>

        {/* Logos row — same height */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <img
            src="/hsel-logo.png"
            alt="HS Emden/Leer"
            style={{ height: "28px", width: "auto", opacity: 0.55 }}
          />
          <div style={{ width: "1px", height: "22px", background: "rgba(255,255,255,0.1)" }} />
          <img
            src="/wadas-logo.png"
            alt="WADAS"
            style={{
              height: "28px",
              width: "auto",
              mixBlendMode: "screen",
              opacity: 0.9,
            }}
          />
        </div>

        {/* Brand name + year */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.25em",
            color: "rgba(255,255,255,0.45)",
          }}>
            WADAS PRODUCTION
          </div>
          <div style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "10px",
            color: "rgba(255,255,255,0.18)",
            letterSpacing: "0.08em",
            marginTop: "2px",
          }}>
            © {year} · Hochschule Emden/Leer · Medientechnik · SS 2026
          </div>
        </div>

        {/* GitHub */}
        <a
          href="https://github.com/WADAStube/Esport-Event"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            fontFamily: "'Rajdhani', sans-serif", fontSize: "10px",
            color: "rgba(255,255,255,0.2)", textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px",
            padding: "3px 11px", transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.color = "rgba(0,229,255,0.6)";
            el.style.borderColor = "rgba(0,229,255,0.18)";
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.color = "rgba(255,255,255,0.2)";
            el.style.borderColor = "rgba(255,255,255,0.06)";
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          WADAStube / Esport-Event
        </a>

      </div>
    </footer>
  );
}
