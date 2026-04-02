import { useLocation } from "wouter";
import { usePlanner } from "./PlannerContext";
import { SECTIONS, TEAM_MEMBERS, PROFESSORS } from "./data";

export default function TopNav() {
  const [location, navigate] = useLocation();
  const { selectedOptions, setActiveSectionId, activeSectionId } = usePlanner();

  const decidedSections = SECTIONS.filter(s => (selectedOptions[s.id]?.length ?? 0) > 0).length;
  const totalSections = SECTIONS.length;
  const progressPct = Math.round((decidedSections / totalSections) * 100);
  const isComplete = progressPct === 100;

  function goSection(id: string) {
    setActiveSectionId(id);
    navigate("/");
  }

  const isOnSection = location === "/";

  return (
    <div
      className="sticky top-0 z-50 mb-8"
      style={{ background: "rgba(10,10,18,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div style={{ textAlign: "center", paddingTop: "20px", paddingBottom: "8px", paddingLeft: "16px", paddingRight: "16px" }}>

        {/* Institution line */}
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", color: "#00e5ff", letterSpacing: "0.25em", marginBottom: "6px", opacity: 0.8 }}>
          Hochschule Emden/Leer &nbsp;·&nbsp; Medientechnik &nbsp;·&nbsp; AV-Produktion &nbsp;·&nbsp; SS 2026
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "clamp(18px, 4vw, 32px)",
          fontWeight: 900,
          letterSpacing: "0.05em",
          background: "linear-gradient(90deg, #fff 0%, #00e5ff 50%, #a855f7 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: "0 0 4px",
          lineHeight: 1.2,
        }}>
          E-Sports Event — Gruppenplanung
        </h1>

        {/* Team members compact */}
        <div style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center",
          gap: "4px 10px", marginBottom: "10px",
          fontFamily: "'Rajdhani', sans-serif", fontSize: "10px",
        }}>
          {PROFESSORS.map(p => (
            <span key={p.id} style={{ color: "#a855f7", opacity: 0.75 }}>{p.name}</span>
          ))}
          <span style={{ color: "rgba(255,255,255,0.12)" }}>·</span>
          {TEAM_MEMBERS.map((m, i) => (
            <span key={m.id} style={{ color: "rgba(255,255,255,0.38)" }}>
              {m.name}{i < TEAM_MEMBERS.length - 1 ? "" : ""}
            </span>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", marginBottom: "12px" }}>
          <div style={{ position: "relative", width: "200px", height: "5px", borderRadius: "9999px", overflow: "hidden", background: "rgba(255,255,255,0.07)" }}>
            <div style={{
              position: "absolute", top: 0, bottom: 0, left: 0,
              borderRadius: "9999px",
              transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
              width: `${progressPct}%`,
              background: isComplete
                ? "linear-gradient(90deg, #22c55e, #00e5ff)"
                : "linear-gradient(90deg, #00e5ff, #a855f7)",
              boxShadow: isComplete ? "0 0 10px #22c55e88" : "0 0 8px #00e5ff66",
            }} />
          </div>
          <span style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "10px",
            fontWeight: 900,
            color: isComplete ? "#22c55e" : "#00e5ff",
          }}>
            {isComplete ? "✓ FERTIG" : `${decidedSections} / ${totalSections}`}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px", padding: "0 12px 14px" }}>
        {SECTIONS.map(sec => {
          const done = (selectedOptions[sec.id]?.length ?? 0) > 0;
          const isActive = isOnSection && activeSectionId === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => goSection(sec.id)}
              style={{
                position: "relative",
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "12px",
                fontWeight: isActive ? 700 : 600,
                padding: "4px 10px",
                borderRadius: "6px",
                cursor: "pointer",
                border: `1px solid ${
                  isActive ? "rgba(0,229,255,0.6)"
                  : done ? "rgba(0,229,255,0.25)"
                  : "rgba(255,255,255,0.07)"}`,
                background: isActive
                  ? "rgba(0,229,255,0.18)"
                  : done ? "rgba(0,229,255,0.06)"
                  : "transparent",
                color: isActive ? "#00e5ff"
                  : done ? "rgba(0,229,255,0.8)"
                  : "rgba(255,255,255,0.45)",
                transition: "all 0.15s",
                boxShadow: isActive ? "0 0 10px rgba(0,229,255,0.2)" : "none",
              }}
            >
              {done && !isActive && (
                <span style={{
                  position: "absolute", top: "-4px", right: "-4px",
                  width: "10px", height: "10px", borderRadius: "50%",
                  background: "#00e5ff", color: "#0a0a12",
                  fontSize: "6px", fontWeight: 900,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>✓</span>
              )}
              {sec.title}
            </button>
          );
        })}

        {/* Separator */}
        <div style={{ width: "1px", height: "22px", background: "rgba(255,255,255,0.08)", margin: "0 2px", alignSelf: "center" }} />

        {/* Fixed pages */}
        {[
          { path: "/notizen", label: "Notizen", color: "#22c55e", bg: "rgba(34,197,94," },
          { path: "/team",    label: "Team",    color: "#a855f7", bg: "rgba(168,85,247," },
          { path: "/plan",    label: "Unser Plan", color: "#00e5ff", bg: "rgba(0,229,255," },
          { path: "/refs",    label: "Referenzen", color: "#f59e0b", bg: "rgba(245,158,11," },
        ].map(({ path, label, color, bg }) => {
          const isActive = location === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "12px",
                fontWeight: isActive ? 700 : 600,
                padding: "4px 10px",
                borderRadius: "6px",
                cursor: "pointer",
                border: `1px solid ${isActive ? `${color}66` : "rgba(255,255,255,0.07)"}`,
                background: isActive ? `${bg}0.18)` : "transparent",
                color: isActive ? color : "rgba(255,255,255,0.45)",
                transition: "all 0.15s",
                boxShadow: isActive ? `0 0 10px ${bg}0.15)` : "none",
              }}
            >
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
