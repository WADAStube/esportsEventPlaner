import { usePlanner } from "./PlannerContext";
import { SECTIONS } from "./data";
import { useLocation } from "wouter";

export default function Notizen() {
  const { sectionNotes, setSectionNote, setActiveSectionId } = usePlanner();
  const [, navigate] = useLocation();

  const sectionsWithNotes = SECTIONS.filter(s => sectionNotes[s.id]?.trim());
  const sectionsWithout   = SECTIONS.filter(s => !sectionNotes[s.id]?.trim());

  function goToSection(id: string) {
    setActiveSectionId(id);
    navigate("/");
  }

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 16px 64px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "22px", fontWeight: 900, background: "linear-gradient(90deg, #fff, #00e5ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "6px" }}>
          Notizen
        </h2>
        <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.45)" }}>
          Alle Bereichs-Notizen an einem Ort — direkt bearbeitbar.
        </p>
      </div>

      {/* Sections with notes */}
      {sectionsWithNotes.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.25em", color: "rgba(0,229,255,0.6)", marginBottom: "12px" }}>— MIT NOTIZEN ({sectionsWithNotes.length})</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {sectionsWithNotes.map(sec => (
              <div key={sec.id} style={{ background: "rgba(0,229,255,0.03)", border: "1px solid rgba(0,229,255,0.18)", borderRadius: "12px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "10px", color: "#00e5ff", letterSpacing: "0.15em" }}>{sec.title.toUpperCase()}</div>
                  <button onClick={() => goToSection(sec.id)}
                    style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", color: "rgba(0,229,255,0.6)", background: "transparent", border: "1px solid rgba(0,229,255,0.2)", borderRadius: "5px", padding: "3px 10px", cursor: "pointer", letterSpacing: "0.1em" }}>
                    → BEREICH ÖFFNEN
                  </button>
                </div>
                <textarea
                  value={sectionNotes[sec.id] || ""}
                  onChange={e => setSectionNote(sec.id, e.target.value)}
                  rows={Math.max(3, (sectionNotes[sec.id] || "").split("\n").length + 1)}
                  style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 13px", color: "white", fontFamily: "'Rajdhani', sans-serif", fontSize: "14px", lineHeight: "1.6", resize: "vertical", outline: "none" }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px" }}>
                  <button onClick={() => setSectionNote(sec.id, "")}
                    style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "8px", color: "rgba(255,80,80,0.45)", background: "transparent", border: "1px solid rgba(255,80,80,0.12)", borderRadius: "5px", padding: "3px 9px", cursor: "pointer", letterSpacing: "0.1em" }}>
                    LÖSCHEN
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sections without notes */}
      {sectionsWithout.length > 0 && (
        <div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", letterSpacing: "0.25em", color: "rgba(255,255,255,0.2)", marginBottom: "12px" }}>— NOCH LEER ({sectionsWithout.length})</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "8px" }}>
            {sectionsWithout.map(sec => (
              <button key={sec.id} onClick={() => goToSection(sec.id)}
                style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "10px", padding: "12px 14px", cursor: "pointer", textAlign: "left" }}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", marginBottom: "4px" }}>{sec.title.toUpperCase()}</div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>Noch keine Notiz</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {sectionsWithNotes.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 24px", background: "rgba(255,255,255,0.01)", border: "1px dashed rgba(255,255,255,0.07)", borderRadius: "16px" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>📝</div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: "8px" }}>NOCH KEINE NOTIZEN</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.2)" }}>
            Öffne einen Bereich und scrolle nach unten zum Notiz-Feld.
          </div>
        </div>
      )}
    </div>
  );
}
